import React from "react";
import { getProviders, signIn } from "next-auth/react";

const Login = ({ providers }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full">
      <img
        src="https://links.papareact.com/9xl"
        alt="spotify"
        className="w-52 mb-5"
      />
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button
              className="bg-[#18D860] text-white p-3 rounded-lg"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Login;

//server side rendering
export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
