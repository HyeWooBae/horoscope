import React from 'react'
import { Alert, Card, Flex } from 'antd'
import Styles from './SajuResult.module.scss'
import { getSaju } from '@/lib/saju'

const OHAENG_LABEL = { 木: '목(木)', 火: '화(火)', 土: '토(土)', 金: '금(金)', 水: '수(水)' }

// 서버 컴포넌트: 서버에서 Supabase 조회 후 결과 HTML 을 그려서 보냄
async function SajuResult({ input }) {
  const result = await getSaju(input)

  if (result.error) return <Alert type="error" title={result.error} showIcon />

  return (
    <div className={Styles.result}>
      <Card>
        <p className={Styles.summary}>
          {result.name || '이름 없음'} · {result.gender || '성별 미선택'} · 양력 {result.solarDate} · 음력 {result.lunarDate}
        </p>
        <div className={Styles.pillars}>
          {result.pillars.map((p) => (
            <div key={p.label} className={Styles.pillar}>
              <span className={Styles.pillarLabel}>{p.label}</span>
              <strong className={Styles.pillarHanja}>{p.hanja ?? '?'}</strong>
              <span>{p.hangul ?? '모름'}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="음양오행">
        <Flex gap={16} wrap>
          {Object.entries(result.ohaeng).map(([key, count]) => (
            <span key={key}>
              {OHAENG_LABEL[key]} <strong>{count}</strong>
            </span>
          ))}
          <span>
            양 <strong>{result.yinYang.yang}</strong> · 음 <strong>{result.yinYang.yin}</strong>
          </span>
        </Flex>
      </Card>

      {result.ilgan && (
        <Card title={`일간 ${result.pillars[1].hanja[0]} — ${result.ilgan.title}`}>
          <p>{result.ilgan.content}</p>
        </Card>
      )}

      {[...result.many, ...result.few].map((t) => (
        <Card key={`${t.category}-${t.code}`} title={t.title}>
          <p>{t.content}</p>
        </Card>
      ))}
    </div>
  )
}

export default SajuResult
