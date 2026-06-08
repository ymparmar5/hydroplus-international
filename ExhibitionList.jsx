import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../Context/myContext';

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
        if (confirmed) {
            try {
                await deleteExhibition(exhibitionId);
            } catch (error) {
                // Error handled in context
            }
        }
    };

    const handleStatusToggle = async (exhibitionId, currentStatus) => {
        try {
            await toggleExhibitionStatus(exhibitionId, currentStatus);
        } catch (error) {
            // Error handled in context
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64 text-white">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Loading exhibitions...</span>
                </div>
            </div>
        );
    }

    const publishedExhibitions = getPublishedExhibitions();
    const draftExhibitions = getDraftExhibitions();

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Exhibition Management</h1>
                    <button
                        onClick={() => navigate('/addExhibition')}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Add New Exhibition
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Exhibitions</h3>
                        <p className="text-3xl font-bold text-white">{exhibitions.length}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Published</h3>
                        <p className="text-3xl font-bold text-green-400">{publishedExhibitions.length}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Drafts</h3>
                        <p className="text-3xl font-bold text-yellow-400">{draftExhibitions.length}</p>
                    </div>
                </div>

                {exhibitions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-4">No exhibitions found</div>
                        <button
                            onClick={() => navigate('/addExhibition')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Create Your First Exhibition
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Exhibition
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Published Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Sections
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-600">
                                    {exhibitions.map((exhibition) => (
                                        <tr key={exhibition.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {exhibition.headerImage && (
                                                        <img
                                                            src={exhibition.headerImage}
                                                            alt={exhibition.title}
                                                            className="w-12 h-12 rounded-lg object-cover mr-4"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {exhibition.title}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            Created: {exhibition.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    exhibition.status === 'published' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {exhibition.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {formatDate(exhibition.publishedDate)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {exhibition.sections?.length || 0} sections
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/addExhibition/${exhibition.id}`)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusToggle(exhibition.id, exhibition.status)}
                                                        className={`transition-colors ${
                                                            exhibition.status === 'published'
                                                                ? 'text-yellow-400 hover:text-yellow-300'
                                                                : 'text-green-400 hover:text-green-300'
                                                        }`}
                                                    >
                                                        {exhibition.status === 'published' ? 'Unpublish' : 'Publish'}
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/exhibition/${exhibition.id}`)}
                                                        className="text-gray-400 hover:text-gray-300 transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exhibition.id, exhibition.title)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExhibitionList;