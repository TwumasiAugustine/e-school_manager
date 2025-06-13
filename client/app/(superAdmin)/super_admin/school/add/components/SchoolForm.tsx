import React, { useState, useEffect } from 'react';
import { showToast } from '@/components/ToastContainer';

interface SchoolFormProps {
    onSubmit: (data: Record<string, string>) => Promise<void>;
    loading?: boolean;
    initialData?: Partial<typeof initialState>;
    title?: string;
}

const initialState = {
    name: '',
    logo: '',
    email: '',
    phone: '',
    tagline: '',
    address: '',
    codePrefix: 'SCH', // add fallback for missing type
    codeNumber: '',
    domainType: 'default',
    domain: '',
    emergencyContact: '',
};

const SchoolForm: React.FC<SchoolFormProps> = ({ onSubmit, loading, initialData, title }) => {
    const [form, setForm] = useState(initialData ? { ...initialState, ...initialData } : initialState);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDomainTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, domainType: e.target.value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm((prev) => ({ ...prev, logo: e.target.files![0].name }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.address ||
            !form.logo ||
            !form.tagline
        ) {
            showToast('Please fill all required fields.', 'error');
            return;
        }
        await onSubmit(form);
    };

    useEffect(() => {
        if (initialData) {
            setForm({ ...initialState, ...initialData });
        }
    }, [initialData]);

    return (
        <form
            className="bg-white rounded-lg shadow-md p-4 max-w-4xl mx-auto"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                {title || (initialData ? 'Edit School' : 'Create School')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="Green Valley International School"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            name="logo"
                            value={form.logo}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition flex-1 bg-gray-100 cursor-not-allowed"
                            placeholder="school_logo.png"
                            required
                        />
                        <label
                            className="px-4 py-2 rounded font-semibold transition focus:outline-none bg-emerald-600 text-white cursor-pointer flex items-center"
                        >
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        School Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="info@greenvalley.edu"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        School Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="+1 555-123-4567"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Tagline <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="tagline"
                        value={form.tagline}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="Nurturing Excellence, Inspiring Success"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="123 Green Valley Rd, Springfield, IL"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        School Code Prefix <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            name="codePrefix"
                            value={form.codePrefix}
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition w-24 bg-gray-100 cursor-not-allowed"
                            placeholder="SCH"
                            required
                            readOnly
                        />
                        <input
                            name="codeNumber"
                            value={form.codeNumber}
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition w-32"
                            placeholder="2025219"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Domain Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6 items-center mt-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="domainType"
                                value="default"
                                checked={form.domainType === 'default'}
                                onChange={handleDomainTypeChange}
                                className="accent-emerald-600"
                            />
                            <span>Default</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="domainType"
                                value="custom"
                                checked={form.domainType === 'custom'}
                                onChange={handleDomainTypeChange}
                                className="accent-emerald-600"
                            />
                            <span>Custom</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Default Domain</label>
                    <div className="flex gap-2">
                        <input
                            name="domain"
                            value={form.domain}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            placeholder="greenvalley"
                            disabled={form.domainType !== 'default'}
                        />
                        <span className="self-center text-gray-500 text-sm">
                            .eschool.com
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Emergency Contact</label>
                    <input
                        name="emergencyContact"
                        value={form.emergencyContact}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="+1 555-987-6543"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="reset"
                    className="px-4 py-2 rounded font-semibold transition focus:outline-none bg-gray-300 text-gray-700 hover:bg-gray-400"
                    onClick={() => setForm(initialState)}
                    disabled={loading}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded font-semibold transition focus:outline-none bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
};

export default SchoolForm;
