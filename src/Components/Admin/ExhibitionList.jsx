import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Eye, Plus, Send, Trash2 } from 'lucide-react';
import myContext from '../../Context/myContext';

const getExhibitionId = (exhibition) => exhibition?._id || exhibition?.id;

const ExhibitionList = () => {
    const navigate = useNavigate();
    const {
        exhibitions,
        loading,
        deleteExhibition,
        toggleExhibitionStatus,
        getPublishedExhibitions,
        getDraftExhibitions
    } = useContext(myContext);

    const handleDelete = async (exhibitionId, title) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (confirmed) await deleteExhibition(exhibitionId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center text-white">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    const publishedExhibitions = getPublishedExhibitions();
    const draftExhibitions = getDraftExhibitions();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Events</p>
                    <h2 className="mt-1 text-2xl font-bold text-white">Exhibition Management</h2>
                </div>
                <button
                    onClick={() => navigate('/addExhibition')}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-orange-600"
                >
                    <Plus className="h-4 w-4" />
                    Add New Exhibition
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                    ['Total Exhibitions', exhibitions.length],
                    ['Published', publishedExhibitions.length],
                    ['Drafts', draftExhibitions.length],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                        <p className="text-sm font-semibold text-gray-400">{label}</p>
                        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl">
                {exhibitions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                        <Send className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-lg font-bold text-white">No exhibitions found</h3>
                        <p className="mt-1 text-sm text-gray-400">Create the first exhibition page from the admin panel.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-black/50">
                                <tr>
                                    {['Exhibition', 'Status', 'Published Date', 'Sections', 'Actions'].map((heading) => (
                                        <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {exhibitions.map((exhibition) => {
                                    const exhibitionId = getExhibitionId(exhibition);
                                    const isPublished = exhibition.status === 'published';

                                    return (
                                        <tr key={exhibitionId} className="transition hover:bg-white/[0.03]">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-20 overflow-hidden rounded-md border border-white/10 bg-white">
                                                        <img
                                                            src={exhibition.headerImage || "/noimg.png"}
                                                            alt={exhibition.title}
                                                            className="h-full w-full object-cover"
                                                            onError={(event) => { event.currentTarget.src = "/noimg.png"; }}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="max-w-xs truncate text-sm font-bold text-white">{exhibition.title}</p>
                                                        <p className="mt-1 text-xs text-gray-500">Created: {exhibition.date || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isPublished ? 'bg-emerald-400/15 text-emerald-300' : 'bg-yellow-400/15 text-yellow-300'}`}>
                                                    {isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-300">{formatDate(exhibition.publishedDate)}</td>
                                            <td className="px-5 py-4 text-sm text-gray-300">{exhibition.sections?.length || 0}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/addExhibition/${exhibitionId}`)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-400/30 bg-blue-400/10 text-blue-300 transition hover:bg-blue-500 hover:text-white"
                                                        aria-label={`Edit ${exhibition.title}`}
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleExhibitionStatus(exhibitionId, exhibition.status)}
                                                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${isPublished ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-500 hover:text-black' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-500 hover:text-black'}`}
                                                        aria-label={isPublished ? `Unpublish ${exhibition.title}` : `Publish ${exhibition.title}`}
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/exhibitionDetail/${exhibitionId}`)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/10 text-gray-300 transition hover:bg-white hover:text-black"
                                                        aria-label={`View ${exhibition.title}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exhibitionId, exhibition.title)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-400/30 bg-red-400/10 text-red-300 transition hover:bg-red-500 hover:text-white"
                                                        aria-label={`Delete ${exhibition.title}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExhibitionList;
