'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Flex, Input, Select } from 'antd'

// 입력값을 주소(?year=...)에 담아 이동 → 서버 컴포넌트(page.jsx)가 다시 그려짐
function SajuForm({ initial }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(initial)

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = () => {
    const params = new URLSearchParams()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, value)
    })
    startTransition(() => router.push(`/?${params}`))
  }

  return (
    <Flex gap={8} wrap>
      <Input placeholder="이름" style={{ width: 120 }} value={form.name} onChange={(e) => update('name')(e.target.value)} />

      <Select
        placeholder="성별"
        style={{ width: 90 }}
        value={form.gender}
        onChange={update('gender')}
        options={[
          { value: '여성', label: '여성' },
          { value: '남성', label: '남성' },
        ]}
      />

      <Select
        placeholder="양력/음력"
        style={{ width: 110 }}
        value={form.calendar}
        onChange={update('calendar')}
        options={[
          { value: '양력', label: '양력' },
          { value: '음력', label: '음력' },
        ]}
      />

      <Select
        placeholder="년"
        style={{ width: 100 }}
        value={form.year}
        onChange={update('year')}
        options={[...Array(new Date().getFullYear() - 1920 + 1)].map((_, i) => ({
          value: new Date().getFullYear() - i,
          label: `${new Date().getFullYear() - i}년`,
        }))}
      />

      <Select
        placeholder="월"
        style={{ width: 80 }}
        value={form.month}
        onChange={update('month')}
        options={[...Array(12)].map((_, i) => ({
          value: String(i + 1).padStart(2, '0'),
          label: `${String(i + 1).padStart(2, '0')}월`,
        }))}
      />

      <Select
        placeholder="일"
        style={{ width: 80 }}
        value={form.day}
        onChange={update('day')}
        options={[...Array(31)].map((_, i) => ({ value: i + 1, label: `${i + 1}일` }))}
      />

      <Select
        placeholder="태어난 시간"
        style={{ width: 180 }}
        value={form.hour}
        onChange={update('hour')}
        options={[
          { value: '0', label: '모름 (태어난 시간)' },
          { value: '01', label: '子 (23:30 ~ 01:29)' },
          { value: '02', label: '丑 (01:30 ~ 03:29)' },
          { value: '04', label: '寅 (03:30 ~ 05:29)' },
          { value: '06', label: '卯 (05:30 ~ 07:29)' },
          { value: '08', label: '辰 (07:30 ~ 09:29)' },
          { value: '10', label: '巳 (09:30 ~ 11:29)' },
          { value: '12', label: '午 (11:30 ~ 13:29)' },
          { value: '14', label: '未 (13:30 ~ 15:29)' },
          { value: '16', label: '申 (15:30 ~ 17:29)' },
          { value: '18', label: '酉 (17:30 ~ 19:29)' },
          { value: '20', label: '戌 (19:30 ~ 21:29)' },
          { value: '22', label: '亥 (21:30 ~ 23:29)' },
        ]}
      />

      <Button type="primary" loading={isPending} onClick={onSubmit}>
        사주 보기
      </Button>
    </Flex>
  )
}

export default SajuForm
