import { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

function App() {
  const [activeTab, setActiveTab] = useState('teachers');
  
  // States for lists
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  // States for forms
  const [teacherForm, setTeacherForm] = useState({ id: '', name: '', email: '', address: '' });
  const [courseForm, setCourseForm] = useState({ id: '', course_name: '', teacher: '' });
  const [studentForm, setStudentForm] = useState({ id: '', name: '', student_email: '', address: '', course: '' });

  // Fetch Data
  const fetchData = async () => {
    try {
      const [tRes, cRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/teachers/`),
        fetch(`${API_BASE}/courses/`),
        fetch(`${API_BASE}/students/`)
      ]);
      setTeachers(await tRes.json());
      setCourses(await cRes.json());
      setStudents(await sRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generic Save Function (Handles both Create and Update)
  const handleSave = async (e, endpoint, payload, id, resetFormCallback) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/${endpoint}/${id}/` : `${API_BASE}/${endpoint}/`;
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      resetFormCallback();
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Generic Delete Function
  const handleDelete = async (endpoint, id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await fetch(`${API_BASE}/${endpoint}/${id}/`, { method: 'DELETE' });
      fetchData();
    }
  };

  // Tailwind CSS Classes stored as variables for cleaner code
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors";
  const btnPrimary = "px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm";
  const btnSecondary = "px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors shadow-sm";
  const btnEdit = "px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition-colors mr-2 shadow-sm";
  const btnDelete = "px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors shadow-sm";
  const thClass = "px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200 bg-gray-50";
  const tdClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-100";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">School Management Dashboard</h2>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-px">
          {['teachers', 'courses', 'students'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-t-lg font-semibold capitalize transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md transform -translate-y-1' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 border-b-0'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TEACHERS TAB */}
        {activeTab === 'teachers' && (
          <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{teacherForm.id ? 'Edit' : 'Add'} Teacher</h3>
              <form onSubmit={(e) => handleSave(e, 'teachers', teacherForm, teacherForm.id, () => setTeacherForm({ id: '', name: '', email: '', address: '' }))} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className={inputClass} required placeholder="Teacher Name" value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} />
                  <input className={inputClass} required type="email" placeholder="Email Address" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} />
                  <input className={inputClass} required placeholder="Home Address" value={teacherForm.address} onChange={e => setTeacherForm({...teacherForm, address: e.target.value})} />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className={btnPrimary}>Save Teacher</button>
                  <button type="button" className={btnSecondary} onClick={() => setTeacherForm({ id: '', name: '', email: '', address: '' })}>Clear Form</button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead><tr><th className={thClass}>ID</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Address</th><th className={thClass}>Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {teachers.map(t => (
                      <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                        <td className={tdClass}>{t.id}</td><td className={tdClass}>{t.name}</td><td className={tdClass}>{t.email}</td><td className={tdClass}>{t.address}</td>
                        <td className={tdClass}>
                          <button className={btnEdit} onClick={() => setTeacherForm(t)}>Edit</button>
                          <button className={btnDelete} onClick={() => handleDelete('teachers', t.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{courseForm.id ? 'Edit' : 'Add'} Course</h3>
              <form onSubmit={(e) => handleSave(e, 'courses', courseForm, courseForm.id, () => setCourseForm({ id: '', course_name: '', teacher: '' }))} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className={inputClass} required placeholder="Course Name" value={courseForm.course_name} onChange={e => setCourseForm({...courseForm, course_name: e.target.value})} />
                  <select className={inputClass} required value={courseForm.teacher} onChange={e => setCourseForm({...courseForm, teacher: e.target.value})}>
                    <option value="">Select Assignee (Teacher)...</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className={btnPrimary}>Save Course</button>
                  <button type="button" className={btnSecondary} onClick={() => setCourseForm({ id: '', course_name: '', teacher: '' })}>Clear Form</button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead><tr><th className={thClass}>ID</th><th className={thClass}>Course Name</th><th className={thClass}>Teacher ID</th><th className={thClass}>Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map(c => (
                      <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                        <td className={tdClass}>{c.id}</td><td className={tdClass}>{c.course_name}</td><td className={tdClass}>{c.teacher}</td>
                        <td className={tdClass}>
                          <button className={btnEdit} onClick={() => setCourseForm(c)}>Edit</button>
                          <button className={btnDelete} onClick={() => handleDelete('courses', c.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{studentForm.id ? 'Edit' : 'Add'} Student</h3>
              <form onSubmit={(e) => handleSave(e, 'students', studentForm, studentForm.id, () => setStudentForm({ id: '', name: '', student_email: '', address: '', course: '' }))} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input className={inputClass} required placeholder="Student Name" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                  <input className={inputClass} required type="email" placeholder="Student Email" value={studentForm.student_email} onChange={e => setStudentForm({...studentForm, student_email: e.target.value})} />
                  <input className={inputClass} placeholder="Address (Optional)" value={studentForm.address || ''} onChange={e => setStudentForm({...studentForm, address: e.target.value})} />
                  <select className={inputClass} required value={studentForm.course} onChange={e => setStudentForm({...studentForm, course: e.target.value})}>
                    <option value="">Enroll in Course...</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                  </select>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className={btnPrimary}>Save Student</button>
                  <button type="button" className={btnSecondary} onClick={() => setStudentForm({ id: '', name: '', student_email: '', address: '', course: '' })}>Clear Form</button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead><tr><th className={thClass}>ID</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Address</th><th className={thClass}>Course ID</th><th className={thClass}>Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-blue-50 transition-colors">
                        <td className={tdClass}>{s.id}</td><td className={tdClass}>{s.name}</td><td className={tdClass}>{s.student_email}</td><td className={tdClass}>{s.address || <span className="text-gray-400 italic">None</span>}</td><td className={tdClass}>{s.course}</td>
                        <td className={tdClass}>
                          <button className={btnEdit} onClick={() => setStudentForm(s)}>Edit</button>
                          <button className={btnDelete} onClick={() => handleDelete('students', s.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;