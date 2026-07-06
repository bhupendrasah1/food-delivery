const PaymentFailed = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl text-red-500 font-bold">Payment Failed ⚠️</h1>
    <button onClick={() => window.location.href = '/'} className="mt-4 text-blue-500">Go to Home Page</button>
  </div>
);

export default PaymentFailed;