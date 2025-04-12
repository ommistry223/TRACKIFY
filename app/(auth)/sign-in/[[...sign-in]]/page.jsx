import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Image Section */}
        <section className="relative flex w-200 h-48 items-end bg-gray-900 lg:col-span-5 lg:h-full">
          <img
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19"
            alt="Spending Illustration"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <a href="#" className="block text-white">
              <span className="sr-only">Home</span>
              <svg
                className="h-15 w-15 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm.75 17.25h-1.5v-1.364c-1.77-.16-3.083-1.2-3.083-2.636 0-1.146.852-2.022 2.167-2.373l.916-.237v-2.39c-.604.13-1.125.403-1.5.75L8.5 7.25c.645-.709 1.615-1.217 2.75-1.364V4.5h1.5v1.365c1.77.16 3.083 1.199 3.083 2.635 0 1.145-.852 2.021-2.167 2.373l-.916.237v2.39c.604-.13 1.125-.403 1.5-.75l1.25 1.25c-.645.709-1.615 1.217-2.75 1.364V17.25Z" />
              </svg>
            </a>

            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Welcome to SpendWise
            </h2>

            <p className="mt-4 text-lg text-white/90 leading-relaxed">
              Take control of your finances with ease. Track expenses, monitor
              spending, and build smart habits — all in one place.
            </p>
          </div>
        </section>

        {/* Right SignIn Form Section */}
        <main className="flex items-center justify-center px-8 py-12 sm:px-12 lg:col-span-7 lg:px-16 lg:pl-84">
          <div className="w-full max-w-xl">
            {/* Mobile Logo + Intro */}
            <div className="lg:hidden mb-8 text-center">
              <a
                href="#"
                className="inline-flex size-14 items-center justify-center rounded-full bg-indigo-100"
              >
                <svg
                  className="h-8 w-8 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm0 3a1 1 0 0 1 1 1v8l6 3a1 1 0 1 1-1 1.73l-6.5-3.25A1 1 0 0 1 11 13V4a1 1 0 0 1 1-1Z" />
                </svg>
              </a>

              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Welcome Back!
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your money like a pro. Sign in to continue managing your money.
              </p>
            </div>

            {/* Clerk SignIn Component */}
            <div className="">
              <SignIn />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
