export default function Features(): JSX.Element {
  const featuresData = [
    {
      title: 'Retrieve data from local storage',
      description:
        "Effortlessly access previously stored information from the browser's local storage. Retrieve and utilize data seamlessly for your application's needs.",
    },
    {
      title: 'Store data to local storage',
      description:
        'Easily store and preserve important information without any challenges, ensuring convenient future access and utilization.',
    },
    {
      title: 'Nextjs friendly',
      description:
        'you can easy seamlessly integrate the "killua" package with Next.js in both the app directory and the page directory.',
    },
    {
      title: 'TypeScript friendly',
      description:
        'Designed to work seamlessly with TypeScript, providing type safety and improved development experience.',
    },
    {
      title: 'Auto update in other tabs',
      description:
        'Automatically update stored data in other open browser tabs or windows when changes occur.',
    },
    {
      title: 'Auto update in other components',
      description:
        'Automatically update data in other components of the application when changes occur in local storage.',
    },
    {
      title: 'Set expiration timer',
      description:
        'Implement an expiration timer for stored data to automatically remove outdated information.',
    },
    {
      title: 'Encrypt local storage data',
      description:
        'Securely encrypt data stored in local storage to protect sensitive information.',
    },
    {
      title: 'Config file for configuration management',
      description:
        'Utilize a configuration file to manage various settings and options in the application.',
    },
    {
      title: 'Reducer for state management',
      description:
        'Implement a reducer for effective state management, allowing for structured data updates.',
    },
    {
      title: 'Selector for data access',
      description:
        'Use a selector to efficiently access and retrieve data stored in local storage.',
    },
  ];
  return (
    <section>
      <div className="container flex flex-col gap-5">
        {/* head */}
        <div className="flex items-center justify-between">
          <h3 className="font-daysOne text-[26px] lg:text-[36px]">Features</h3>
        </div>
        {/* body */}
        <div>
          {/* mobile */}
          <div className="bg-[#222] p-3 rounded-2xl flex flex-col sm:hidden">
            {featuresData.map((item, index) => {
              return (
                <div
                  className="flex items-center gap-2 py-2.5 border-b border-[#383838] last:pb-0 last:border-none first:pt-0"
                  key={index}
                >
                  {/* number */}
                  <div className="font-semibold rounded-full border-c-gradient w-fit">
                    <div className="bg-[#222] w-10 h-10 rounded-full flex justify-center items-center">
                      {index + 1}
                    </div>
                  </div>
                  {/* title */}
                  <p className="font-medium">{item.title}</p>
                </div>
              );
            })}
          </div>
          {/* desktop */}
          <div className="items-center hidden grid-cols-2 gap-5 lg:grid-cols-3 sm:grid">
            {featuresData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-full pb-[2px] group cursor-default"
                >
                  <div className="absolute inset-0 h-full transition-all duration-300 opacity-0 border-c-gradient group-hover:opacity-100 rounded-3xl" />
                  <div className="relative gap-2 h-full bg-[#222] flex flex-col items-center p-3 rounded-3xl m-[1px]">
                    <div className="flex items-center w-full gap-3">
                      {/* number */}
                      <div className="text-lg font-bold rounded-full border-c-gradient w-fit">
                        <div className="bg-[#222] w-11 h-11 rounded-full flex justify-center items-center">
                          {index + 1}
                        </div>
                      </div>
                      {/* title */}
                      <p className="font-bold text-[18px]">{item.title}</p>
                    </div>
                    {/* description */}
                    <p className="text-[15px] font-light">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
