import React from 'react'
import Styles from './page.module.scss'
import SajuForm from '@/components/saju/SajuForm'
import SajuResult from '@/components/saju/SajuResult'

async function Home({ searchParams }) {
  const { name, gender, calendar, year, month, day, hour } = await searchParams
  const input = {
    name,
    gender,
    calendar,
    year: year ? Number(year) : undefined,
    month,
    day: day ? Number(day) : undefined,
    hour,
  }

  return (
    <div className={Styles.page}>
      <SajuForm initial={input} />
      {calendar && <SajuResult input={input} />}
    </div>
  )
}

export default Home
