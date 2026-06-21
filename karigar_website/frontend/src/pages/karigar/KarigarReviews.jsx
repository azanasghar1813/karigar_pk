import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../../config/api';

export default function KarigarReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/karigar-portal/reviews');
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      showToastMsg('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-poppins relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Reviews</h1>
        <p className="text-slate-500 mt-1">See what your customers are saying about your work.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No Reviews Yet</h3>
          <p className="text-slate-500 text-sm mt-1">Complete more bookings to earn customer reviews!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-slate-800">{review.customer?.fullName || 'Unknown Customer'}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(review.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="flex gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
              {review.reviewText && (
                <p className="text-slate-600 text-sm mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  "{review.reviewText}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
