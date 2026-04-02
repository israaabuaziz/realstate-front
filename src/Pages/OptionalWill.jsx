// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// export default function OptionalWill() {
//   const navigate = useNavigate();
//   const [approvedContracts, setApprovedContracts] = useState([]);
//   const [selectedContracts, setSelectedContracts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [familyMembers, setFamilyMembers] = useState([]);
//   const [selectedHeir, setSelectedHeir] = useState('');
//   const [percent, setPercent] = useState('');
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);
//   const [totalInheritanceValue, setTotalInheritanceValue] = useState(0);

//   useEffect(() => {
//     fetchApprovedContracts();
//     fetchFamilyMembers();
//   }, []);

//   const fetchApprovedContracts = async () => {
//     try {
//       const res = await API.get('/contracts/my-contracts');
//       const approved = (res.data.contracts || []).filter(
//         (c) => c.status === 'approved' || c.status === 'completed'
//       );
//       setApprovedContracts(approved);
//       const total = approved.reduce((sum, c) => sum + (c.price || 0), 0);
//       setTotalInheritanceValue(total);
//     } catch (err) {
//       console.error('Error fetching contracts:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFamilyMembers = async () => {
//     try {
//       const userStr = localStorage.getItem('user');
//       if (!userStr) return;
//       const user = JSON.parse(userStr);
//       const userId = user.id || user._id;
//       const response = await API.get(`/inheritance/family-tree/${userId}`);
//       if (response.data.success && response.data.tree) {
//         const tree = response.data.tree;
//         const members = [];

//         // جمع أفراد العائلة في قائمة مسطحة
//         tree.spouse?.forEach(sp => members.push({
//           nationalId: sp.nationalId,
//           fullName: sp.fullName,
//           relationType: sp.relationType,
//           relationArabic: sp.relationType === 'wife' ? 'زوجة' : 'زوج'
//         }));
//         tree.parents?.forEach(p => members.push({
//           nationalId: p.nationalId,
//           fullName: p.fullName,
//           relationType: p.relationType,
//           relationArabic: p.relationType === 'father' ? 'أب' : 'أم'
//         }));
//         tree.children?.forEach(c => members.push({
//           nationalId: c.nationalId,
//           fullName: c.fullName,
//           relationType: c.relationType,
//           relationArabic: c.relationType === 'son' ? 'ابن' : 'ابنة'
//         }));
//         tree.siblings?.forEach(s => members.push({
//           nationalId: s.nationalId,
//           fullName: s.fullName,
//           relationType: s.relationType,
//           relationArabic: s.relationType === 'brother' ? 'أخ' : 'أخت'
//         }));

//         setFamilyMembers(members);
//       }
//     } catch (err) {
//       console.error('Error fetching family members:', err);
//       setError('حدث خطأ في تحميل أفراد العائلة. يرجى التأكد من إضافة أفراد العائلة أولاً.');
//     }
//   };

//   const toggleContractSelection = (contract) => {
//     setSelectedContracts(prev => {
//       const exists = prev.find(c => c._id === contract._id);
//       if (exists) {
//         return prev.filter(c => c._id !== contract._id);
//       } else {
//         return [...prev, contract];
//       }
//     });
//   };

//   const validate = () => {
//     if (selectedContracts.length === 0) {
//       setError('يرجى اختيار عقار واحد على الأقل');
//       return false;
//     }
//     if (!selectedHeir) {
//       setError('يرجى اختيار وريث من أفراد العائلة');
//       return false;
//     }
//     const percentValue = parseFloat(percent);
//     if (isNaN(percentValue) || percentValue <= 0 || percentValue > 33.33) {
//       setError('النسبة يجب أن تكون أكبر من 0 ولا تتجاوز 33.33%');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // العثور على الوريث المختار
//     const heir = familyMembers.find(m => m.nationalId === selectedHeir);
//     if (!heir) {
//       setError('الوريث غير موجود في العائلة');
//       return;
//     }

//     setSaving(true);
//     try {
//       const willData = {
//         religion: 'muslim',
//         distributionMethod: 'optional',
//         selectedProperties: selectedContracts.map(c => ({
//           contractId: c._id,
//           propertyNumber: c.propertyNumber,
//           propertyType: c.propertyType,
//           ownershipPercentage: c.ownershipPercentage,
//           includeInWill: true
//         })),
//         heirs: [{
//           fullName: heir.fullName,
//           nationalId: heir.nationalId,
//           relationType: heir.relationType,
//           share: parseFloat(percent) / 100,
//           shareType: 'percentage'
//         }]
//       };
//       await API.post('/inheritance/will', willData);
//       alert('تم حفظ الوصية الاختيارية بنجاح');
//       navigate('/my-wills');
//     } catch (err) {
//       console.error('Error saving optional will:', err);
//       alert('حدث خطأ في حفظ الوصية');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8" dir="rtl">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">وصية اختيارية</h2>
//           <div className="bg-blue-50 border-r-4 border-blue-500 p-4 mb-6">
//             <p className="text-gray-700">
//               تسمح لك بتخصيص نسبة إضافية لأحد الورثة في حدود الثلث.
//               <br />
//               <span className="text-red-600 font-semibold">لا تقبل الوصية إذا تجاوزت نسبة 33.33%</span>
//             </p>
//           </div>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <h3 className="font-semibold text-lg mb-3">اختر العقار (يمكن اختيار أكثر من عقار)</h3>
//             <div className="space-y-2 mb-6">
//               {approvedContracts.length === 0 ? (
//                 <p className="text-gray-500">لا يوجد عقارات مقبولة</p>
//               ) : (
//                 approvedContracts.map(contract => (
//                   <div
//                     key={contract._id}
//                     onClick={() => toggleContractSelection(contract)}
//                     className={`border rounded-lg p-3 cursor-pointer transition ${
//                       selectedContracts.some(c => c._id === contract._id)
//                         ? 'border-green-500 bg-green-50'
//                         : 'hover:border-blue-300'
//                     }`}
//                   >
//                     <div className="flex justify-between">
//                       <div>
//                         <p className="font-medium">{contract.propertyType} - {contract.area} م²</p>
//                         <p className="text-sm text-gray-600">{contract.address}</p>
//                       </div>
//                       {selectedContracts.some(c => c._id === contract._id) && (
//                         <span className="text-green-600 text-xl">✓</span>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <h3 className="font-semibold text-lg mb-3">اختر الوريث (واحد فقط)</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <select
//                 value={selectedHeir}
//                 onChange={(e) => setSelectedHeir(e.target.value)}
//                 className="border rounded-lg px-3 py-2"
//                 required
//               >
//                 <option value="">اختر فرد العائلة</option>
//                 {familyMembers.map(member => (
//                   <option key={member.nationalId} value={member.nationalId}>
//                     {member.fullName} - {member.relationArabic}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="number"
//                 placeholder="النسبة المئوية (حد أقصى 33.33%)"
//                 value={percent}
//                 onChange={(e) => setPercent(e.target.value)}
//                 step="0.01"
//                 min="0"
//                 max="33.33"
//                 className="border rounded-lg px-3 py-2"
//                 required
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
//               >
//                 إلغاء
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {saving ? 'جاري الحفظ...' : 'حفظ الوصية'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }