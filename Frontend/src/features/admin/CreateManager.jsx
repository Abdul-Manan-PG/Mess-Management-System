import { useForm } from 'react-hook-form';
import { ShieldAlert } from 'lucide-react';

export default function CreateManager() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("New Manager:", data);
  };

  return (
    <div className="max-w-md p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-semibold">Create Manager</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-700">Manager Name</label>
          <input {...register("name")} className="w-full p-2 border rounded-md bg-zinc-50" />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700">Email / ID</label>
          <input {...register("email")} className="w-full p-2 border rounded-md bg-zinc-50" />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700">Password</label>
          <input type="password" {...register("password")} className="w-full p-2 border rounded-md bg-zinc-50" />
        </div>
        <button className="w-full py-2 font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700">
          Assign Manager Role
        </button>
      </form>
    </div>
  );
}