import { Search, CalendarCheck, CheckCircle2 } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Find Your Service',
      description: 'Choose your required service and specify your area in Lahore, Karachi, or Islamabad.',
      icon: Search
    },
    {
      number: '02',
      title: 'Compare & Book',
      description: 'Review verified badges, hourly rates, and customer reviews before booking your preferred time.',
      icon: CalendarCheck
    },
    {
      number: '03',
      title: 'Relax & Pay on Completion',
      description: 'A certified Karigar arrives with proper tools. Inspect the completed work and pay with peace of mind.',
      icon: CheckCircle2
    }
  ]

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[#FF8A00] text-xs uppercase tracking-widest font-bold">Fast & Simple</span>
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A1930] mt-1 mb-2">
            How KarigarPK Works
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Book trusted craftsmanship in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] border border-gray-200/90 rounded-2xl p-6 sm:p-8 hover:border-[#FF8A00]/50 hover:bg-white hover:shadow-xl transition-all relative overflow-hidden group"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#FF8A00] shadow-sm">
                    <Icon size={24} />
                  </div>
                  <span className="font-poppins font-black text-2xl text-gray-300 group-hover:text-[#FF8A00]/50 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1930] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
