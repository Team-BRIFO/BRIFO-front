interface HomeHeaderProps {
  nickname: string
  companyName: string
}

export default function HomeHeader({ nickname, companyName }: HomeHeaderProps) {
  return (
    <section className="flex items-end justify-between py-3">
      <div>
        <h2 className="dnf-Subtitle2 text-Yellow-40">{nickname}님</h2>
        <p className="dnf-Subtitle2 text-Gray-10 mt-1.5">출근하셨네요!</p>
      </div>

      <div className="pretendard-Caption1 bg-Background1 text-Gray-5 rounded-full px-4 py-2">
        {companyName}
      </div>
    </section>
  )
}
