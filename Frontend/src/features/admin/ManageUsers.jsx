import { useForm } from 'react-hook-form';
import { Upload, UserPlus } from 'lucide-react';
import axios from 'axios'

export default function ManageUsers() {
  const { register, handleSubmit, reset } = useForm();

  const onManualSubmit =async (data) => {
    console.log("Creating User:", data);
  try {
    const response = await axios.post('http://localhost:5000/api/admin/add-student', data);
    alert(response.data.message);
  } catch (error) {
    console.error("API Error:", error);
    alert(error.response?.data?.message || "Failed to add student");
  }
    reset();
  };

  const onFileUpload = async (event) => {
    const file = event.target.files[0];
    console.log("Uploading File:", file);
    //api call here 
    const formData = new FormData();
    formData.append('file', file);


    try {
      const response = await axios.post('http://localhost:5000/api/admin/upload-students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Tells the server a file is coming
        },
      });

      console.log("Server Response:", response.data);
      alert(`Success! ${response.data.count} students uploaded to Database.`);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading file. Check terminal.");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* LEFT: Manual Entry */}
      <div className="p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Add Single Student</h2>
        </div>
        
        <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">Full Name</label>
            <input {...register("name")} className="w-full p-2 border rounded-md bg-zinc-50" placeholder="e.g. Ali Khan" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Roll Number</label>
            <input {...register("rollNumber")} className="w-full p-2 border rounded-md bg-zinc-50" placeholder="e.g. 2024cs643" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Password</label>
            <input type="password" {...register("password")} className="w-full p-2 border rounded-md bg-zinc-50" placeholder="******" />
          </div>
          <button type="submit" className="w-full py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Create Student
          </button>
        </form>
      </div>

      {/* RIGHT: Excel Upload */}
      <div className="p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold">Bulk Upload (Excel)</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg border-zinc-300 bg-zinc-50">
          <label className="cursor-pointer text-center">
            <span className="block mb-2 text-sm text-zinc-500">Click to upload .xlsx file</span>
            <input type="file" accept=".csv, .xlsx, .xls" onChange={onFileUpload} className="hidden" />
            <span className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border rounded-md shadow-sm hover:bg-zinc-50">
              Select File
            </span>
          </label>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Note: The Excel file must have columns: Name, RollNo, Password.
        </p>
      </div>
    </div>
  );
}