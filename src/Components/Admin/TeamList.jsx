import React, { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { uploadImage } from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { Edit3, Plus, Trash2, User, Users, X } from "lucide-react";

const TeamList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    role: "staff", // "founder" | "staff"
    position: "",
    imageUrl: "",
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "team"), orderBy("time", "asc"));
      const querySnapshot = await getDocs(q);
      const membersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersList);
    } catch (error) {
      console.error("Error fetching team members: ", error);
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setForm({
      name: "",
      role: "staff",
      position: "",
      imageUrl: "",
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setForm({
      name: member.name,
      role: member.role || "staff",
      position: member.position || "",
      imageUrl: member.imageUrl || "",
    });
    setEditingId(member.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPEG, PNG, or WebP images");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (form.role === "staff" && !form.position.trim()) {
      toast.error("Position is required for staff members");
      return;
    }
    if (!form.imageUrl) {
      toast.error("Image is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role,
        position: form.role === "founder" ? "" : form.position.trim(),
        imageUrl: form.imageUrl,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      if (editingId) {
        await updateDoc(doc(fireDB, "team", editingId), payload);
        toast.success("Team member updated successfully!");
      } else {
        await addDoc(collection(fireDB, "team"), payload);
        toast.success("Team member added successfully!");
      }
      closeModal();
      fetchMembers();
    } catch (error) {
      console.error("Error saving member: ", error);
      toast.error("Failed to save team member");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${name}" from the team?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "team", id));
      toast.success("Team member removed successfully!");
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member: ", error);
      toast.error("Failed to delete team member");
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300";
  const labelClass = "text-sm text-gray-300 font-medium mb-1 block";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">About Page</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Team & Founders Management</h2>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>

      {loading && members.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl overflow-hidden">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-bold text-white">No team members found</h3>
              <p className="text-sm text-gray-400 mt-1">Add founders or staff members to show them on the About page.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead className="bg-black/50">
                  <tr>
                    {["Member", "Role", "Position", "Date Added", "Actions"].map((heading) => (
                      <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-gray-400 border-b border-white/10">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {members.map((member) => (
                    <tr key={member.id} className="transition hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/10 bg-gray-800 flex-shrink-0">
                            <img
                              src={member.imageUrl || "/admin.png"}
                              alt={member.name}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.currentTarget.src = "/admin.png"; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{member.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${member.role === 'founder' ? 'bg-primary/15 text-primary' : 'bg-blue-400/15 text-blue-300'}`}>
                          {member.role || 'staff'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300 font-medium">
                        {member.role === "founder" ? <span className="text-gray-500 italic">—</span> : member.position}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400">{member.date || "-"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-400/30 bg-blue-400/10 text-blue-300 transition hover:bg-blue-500 hover:text-white"
                            aria-label={`Edit ${member.name}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id, member.name)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-400/30 bg-red-400/10 text-red-300 transition hover:bg-red-500 hover:text-white"
                            aria-label={`Delete ${member.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border border-gray-700 rounded-3xl p-6 md:p-8 relative shadow-2xl animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {editingId ? "Update Team Member" : "Add Team Member"}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  className={inputClass}
                >
                  <option value="staff">Staff / Team Member</option>
                  <option value="founder">Founder / Owner</option>
                </select>
              </div>

              {form.role === "staff" && (
                <div>
                  <label className={labelClass}>Position</label>
                  <input
                    type="text"
                    placeholder="Enter position (e.g. CEO, Accountant)"
                    value={form.position}
                    onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                    className={inputClass}
                    required={form.role === "staff"}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Image</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-orange-600 file:cursor-pointer transition-colors"
                    accept="image/*"
                    disabled={uploadingImage}
                  />
                  
                  {uploadingImage && (
                    <div className="flex items-center text-sm text-gray-400 mt-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading image...
                    </div>
                  )}

                  {form.imageUrl && (
                    <div className="relative inline-block mt-3 border border-white/10 rounded-xl overflow-hidden bg-gray-950 p-1">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-transform hover:scale-110 shadow-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-orange-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamList;
