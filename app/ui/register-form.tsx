export default function RegisterForm() {
  return (
    <form className="space-y-4 mb-8">
      <h1 className="text-xl font-bold">Register</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full p-2 border border-gray-300"
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="block w-full p-2 border border-gray-300"
        />
      </div>
      <button className="block w-full p-2 bg-gray-900 text-white">
        Register
      </button>
    </form>
  )
}
