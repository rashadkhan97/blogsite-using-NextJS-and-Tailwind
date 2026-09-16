// ─────────────────────────────────────────────────────────────
// app/dashboard/profile/page.jsx — My Profile (requirements.md §20-22)
//
// Fetches fresh data from the server (not just AuthContext's cached
// user) since that's the source of truth after any external change.
// Both edits below call updateUser() so the navbar avatar/name update
// immediately, without a relogin (required by §22).
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/Avatar";
import { getProfile, updateProfile, updateProfileImage } from "@/services/user.service";
import { ACCEPT_ATTR, MAX_PHOTO_MB, validatePhoto } from "@/utils/photo";

function Field({ label, value }) {
  return (
    <div className="flex border-b border-gray-100 py-3 last:border-0">
      <span className="w-32 shrink-0 text-sm font-medium text-gray-500">
        {label}
      </span>
      <span className="text-sm text-gray-800">{value || "—"}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Cannot reach the server. Is the backend running?"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const startEditing = () => {
    setForm({ firstName: profile.firstName, lastName: profile.lastName });
    setSaveError("");
    setSavedMessage("");
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) {
      setSaveError("First name and last name are required");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const updated = (await updateProfile(form)).data.data;
      setProfile(updated);
      updateUser(updated);
      setEditing(false);
      setSavedMessage("Profile updated");
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      return;
    }

    const problem = validatePhoto(file);
    if (problem) {
      setPhotoError(problem);
      e.target.value = "";
      setPhotoFile(null);
      return;
    }

    setPhotoError("");
    setUploadMessage("");
    setPhotoFile(file);
  };

  const handleUpload = async () => {
    if (!photoFile) return;

    setUploading(true);
    setPhotoError("");

    try {
      const updated = (await updateProfileImage(photoFile)).data.data;
      setProfile(updated);
      updateUser(updated);
      setPhotoFile(null);
      setUploadMessage("Profile image updated");
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">My Profile</h1>

      <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
        {loading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : error ? (
          <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <Avatar user={profile} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profile.firstName} {profile.lastName}
                </h2>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-600">
                  {profile.role}
                </span>
              </div>
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Profile Image
              </label>

              {photoError && (
                <p className="mb-2 rounded bg-red-50 p-2 text-sm text-red-600">
                  {photoError}
                </p>
              )}
              {uploadMessage && (
                <p className="mb-2 rounded bg-green-50 p-2 text-sm text-green-700">
                  {uploadMessage}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept={ACCEPT_ATTR}
                  onChange={handlePhotoChange}
                  className="block text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!photoFile || uploading}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, GIF or WEBP. Max {MAX_PHOTO_MB} MB.
              </p>
            </div>

            {saveError && (
              <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                {saveError}
              </p>
            )}
            {savedMessage && !editing && (
              <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">
                {savedMessage}
              </p>
            )}

            {editing ? (
              <form onSubmit={handleSave}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <Field label="First name" value={profile.firstName} />
                <Field label="Last name" value={profile.lastName} />
                <Field label="Email" value={profile.email} />
                <Field label="Role" value={profile.role} />

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <button
                    onClick={startEditing}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit profile
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
