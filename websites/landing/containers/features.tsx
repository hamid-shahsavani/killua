export default function Features(): JSX.Element {
  const featuresData = [
    {
      title: 'Get data from localStorage',
      description:
        'Easily retrieve and access stored data from localStorage without any hassle, ensuring convenient data management and utilization.'
    },
    {
      title: 'Set data to localStorage',
      description:
        'Effortlessly store and manage data in localStorage, allowing for easy access and retrieval when needed.'
    },
    {
      title: 'Reducer for state management',
      description:
        'Implement a reducer for effective state management, allowing for structured data updates.'
    },
    {
      title: 'Selector for data access',
      description:
        'Use a selector to efficiently access and retrieve data stored in localStorage.'
    },
    {
      title: 'Expiration timer',
      description:
        'Implement an expiration timer for stored data to automatically remove outdated information.'
    },
    {
      title: 'Schema validation',
      description:
        'Utilize schema validation to ensure the accuracy and integrity of stored data.'
    },
    {
      title: 'Obfuscate data in localStorage',
      description: 'obfuscate data in localStorage to obscure information.'
    },
    {
      title: 'Server-Side Compatibility',
      description:
        'Fully compatible with server-side applications for seamless integration.'
    },
    {
      title: 'TypeScript friendly',
      description:
        'Built with TypeScript, ensuring type safety and compatibility with TypeScript applications.'
    },
    {
      title: 'Auto update in other tabs',
      description:
        'Automatically update stored data in other open browser tabs or windows when changes occur.'
    },
    {
      title: 'Auto update in other components',
      description:
        'Automatically update data in other components of the application when changes occur in localStorage.'
    },
    {
      title: 'Config file for configuration management',
      description:
        'Utilize a configuration file to manage various settings and options in the application.'
    }
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
          {/* desktop */}
          <div className="items-center grid-cols-full sm:grid-cols-2 gap-4 lg:grid-cols-3 grid">
            {featuresData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-full pb-[2px] group cursor-default"
                >
                  <div className="absolute inset-0 h-full transition-all duration-300 opacity-0 border-c-gradient group-hover:opacity-100 rounded-3xl" />
                  <div className="relative gap-2.5 h-full bg-[#222] flex flex-col items-center p-3.5 rounded-3xl m-[1px]">
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
                    <p className="text-[15px] font-normal">
                      {item.description}
                    </p>
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
