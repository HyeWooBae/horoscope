import { supabase } from '@/lib/supabase'

const OHAENG = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
}
const YANG = '甲丙戊庚壬子寅辰午申戌'

const pad = (n) => String(n).padStart(2, '0')

// 절입일 비교용 출생 시각(KST). 시간 모름은 정오, 子시는 00:30, 나머지는 시진 중간
function birthInstant(solarDate, hour) {
  const time = hour === '0' ? '12:00' : hour === '01' ? '00:30' : `${hour}:30`
  return new Date(`${solarDate}T${time}:00+09:00`)
}

// 에러는 throw 하지 않고 { error } 로 돌려줘서 화면에 그대로 표시
export async function getSaju({ name, gender, calendar, year, month, day, hour }) {
  if (!calendar || !year || !month || !day || !hour) {
    return { error: '양력/음력, 생년월일, 태어난 시간을 모두 선택해 주세요.' }
  }

  try {
    let query = supabase.from('saju_days').select('*')
    if (calendar === '양력') {
      query = query.eq('solar_date', `${year}-${pad(month)}-${pad(day)}`)
    } else {
      query = query
        .eq('lunar_year', Number(year))
        .eq('lunar_month', Number(month))
        .eq('lunar_day', Number(day))
        .eq('is_leap_month', false)
    }
    const { data: days, error: dayError } = await query.limit(1)
    if (dayError) return { error: dayError.message }
    if (!days.length) return { error: '존재하지 않는 날짜이거나 지원 범위(1920~2026년) 밖입니다.' }
    const d = days[0]

    // 절기가 바뀌는 날은 절입 시각 이후 출생이면 새 연주·월주를 사용
    const afterJeolgi = d.jeolgi_at && birthInstant(d.solar_date, hour) >= new Date(d.jeolgi_at)
    const yearPillar = afterJeolgi ? [d.jeolgi_year_pillar, d.jeolgi_year_pillar_kr] : [d.year_pillar, d.year_pillar_kr]
    const monthPillar = afterJeolgi ? [d.jeolgi_month_pillar, d.jeolgi_month_pillar_kr] : [d.month_pillar, d.month_pillar_kr]

    let hourPillar = null
    if (hour !== '0') {
      const { data: h, error } = await supabase
        .from('saju_hours')
        .select('hour_pillar, hour_pillar_kr')
        .eq('day_stem', d.day_pillar[0])
        .eq('hour_value', hour)
        .single()
      if (error) return { error: error.message }
      hourPillar = [h.hour_pillar, h.hour_pillar_kr]
    }

    const pillars = [
      { label: '시주', hanja: hourPillar?.[0] ?? null, hangul: hourPillar?.[1] ?? null },
      { label: '일주', hanja: d.day_pillar, hangul: d.day_pillar_kr },
      { label: '월주', hanja: monthPillar[0], hangul: monthPillar[1] },
      { label: '연주', hanja: yearPillar[0], hangul: yearPillar[1] },
    ]

    const chars = pillars.flatMap((p) => (p.hanja ? [...p.hanja] : []))
    const ohaeng = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
    chars.forEach((c) => ohaeng[OHAENG[c]]++)
    const yang = chars.filter((c) => YANG.includes(c)).length

    const { data: texts, error: textError } = await supabase.from('saju_texts').select('*')
    if (textError) return { error: textError.message }

    return {
      name,
      gender,
      solarDate: d.solar_date,
      lunarDate: `${d.lunar_year}-${pad(d.lunar_month)}-${pad(d.lunar_day)}${d.is_leap_month ? ' (윤달)' : ''}`,
      pillars,
      ohaeng,
      yinYang: { yang, yin: chars.length - yang },
      ilgan: texts.find((t) => t.category === 'ilgan' && t.code === d.day_pillar[0]),
      many: texts.filter((t) => t.category === 'ohaeng_many' && ohaeng[t.code] >= 3),
      few: texts.filter((t) => t.category === 'ohaeng_few' && ohaeng[t.code] === 0),
    }
  } catch {
    return { error: '사주 데이터에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.' }
  }
}
