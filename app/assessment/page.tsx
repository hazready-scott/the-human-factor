import AIReadinessQuiz from '@/components/AIReadinessQuiz'

export const metadata = {
  title: 'AI Readiness Assessment | The Human Factor',
  description:
    'Take our free 21-question AI Readiness Assessment to evaluate your organization across 7 key dimensions. Get instant results with actionable insights.',
}

export default function AssessmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 px-6 bg-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Readiness Assessment
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            21 questions across 7 dimensions. Understand where your organization
            stands and what to focus on next. Takes about 5 minutes.
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="section-pad">
        <div className="max-w-3xl mx-auto">
          <AIReadinessQuiz />
        </div>
      </section>
    </>
  )
}
