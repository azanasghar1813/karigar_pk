import { Search, BookOpen, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Search',
      description: 'Choose your service and enter your location in Lahore',
      icon: Search
    },
    {
      number: 2,
      title: 'Book',
      description: 'Select a verified karigar, pick date & time that suits you',
      icon: BookOpen
    },
    {
      number: 3,
      title: 'Done',
      description: 'Karigar arrives at your door. Pay cash after job is done',
      icon: CheckCircle
    }
  ]

  return (
    <section className="py-10 sm:py-14 md:py-16 px-4 bg-field-general">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">How Karigar Works</h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Book a trusted karigar in 3 simple steps</p>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-3 sm:gap-8 overflow-x-auto pb-2 snap-x snap-mandatory">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="min-w-[78%] sm:min-w-[60%] md:min-w-0 bg-gray-800 rounded-2xl p-5 sm:p-8 text-center hover:shadow-2xl transition-all border border-gray-700 snap-start"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center text-white font-poppins font-bold text-lg sm:text-2xl mx-auto mb-4 sm:mb-6">
                  {step.number}
                </div>
                <div className="text-secondary mb-3 sm:mb-4 flex justify-center">
                  <Icon size={36} className="sm:w-12 sm:h-12" />
                </div>
                <h3 className="font-poppins text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}