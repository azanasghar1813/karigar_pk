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
    <section className="py-14 sm:py-16 px-4 bg-[#0B1329] text-white border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[#FF6B00] text-xs uppercase tracking-widest font-bold">Fast & Simple</span>
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold mt-1 mb-3">
            How KarigarPK Works
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Book trusted craftsmanship in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-[#131F3D] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all relative overflow-hidden group shadow-lg"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1329] border border-gray-700/80 flex items-center justify-center text-[#FF6B00]">
                    <Icon size={24} />
                  </div>
                  <span className="font-poppins font-black text-2xl text-gray-700 group-hover:text-[#FF6B00]/40 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-poppins text-lg sm:text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
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
