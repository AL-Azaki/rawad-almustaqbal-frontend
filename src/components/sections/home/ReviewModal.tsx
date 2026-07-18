import { X, Star, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Modal } from '../../ui/Modal';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
}: ReviewModalProps) {
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isReviewSuccess, setIsReviewSuccess] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    
    setSubmittingReview(true);
    try {
      await api.post('/testimonials', reviewForm);
      setIsReviewSuccess(true);
      setReviewForm({ name: '', role: '', text: '', rating: 5 });
    } catch (err) {
      toast.error('حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <Modal.Body className="!bg-transparent !p-8 relative">
        <Button 
          aria-label="إغلاق النافذة"
          onClick={onClose}
          variant="ghost"
          className="absolute top-4 right-4 !p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-700 !rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </Button>
        {isReviewSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">شكراً لك!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              تم استلام تقييمك بنجاح. سيقوم فريق الإدارة بمراجعته قريباً ثم سيتم نشره في الموقع. نحن نقدر ثقتك بنا!
            </p>
            <Button 
              onClick={() => {
                setIsReviewSuccess(false);
                onClose();
              }}
              variant="secondary"
              className="font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-1"
            >
              حسناً، إغلاق
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-5 mt-4">
            <div>
              <label htmlFor="review-name" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">الاسم <span className="text-red-500">*</span></label>
              <Input 
                id="review-name"
                type="text" 
                required
                value={reviewForm.name}
                onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                className="!bg-gray-50 dark:!bg-gray-900 text-gray-900 dark:text-white"
                placeholder="اسمك الكريم"
              />
            </div>
            
            <div>
              <label htmlFor="review-role" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">المسمى (اختياري)</label>
              <Input 
                id="review-role"
                type="text" 
                value={reviewForm.role}
                onChange={(e) => setReviewForm({...reviewForm, role: e.target.value})}
                className="!bg-gray-50 dark:!bg-gray-900 text-gray-900 dark:text-white"
                placeholder="مثال: مالك فيلا، شركة كذا..."
              />
            </div>

            <div>
              <label id="review-rating-label" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">التقييم</label>
              <div className="flex gap-2" role="radiogroup" aria-labelledby="review-rating-label">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star} 
                    role="radio"
                    aria-checked={star === reviewForm.rating}
                    aria-label={`${star} من 5 نجوم`}
                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full cursor-pointer"
                  >
                    <Star 
                      aria-hidden="true"
                      className={`w-8 h-8 transition-colors ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="review-text" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">رأيك <span className="text-red-500">*</span></label>
              <Textarea 
                id="review-text"
                required
                rows={4}
                value={reviewForm.text}
                onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                className="!bg-gray-50 dark:!bg-gray-900 text-gray-900 dark:text-white"
                placeholder="اكتب تجربتك معنا هنا..."
              />
            </div>

            <Button 
              type="submit" 
              loading={submittingReview}
              variant="primary"
              fullWidth
              className="font-bold py-4 rounded-xl shadow-lg transition-all"
            >
              {submittingReview ? 'جاري الإرسال...' : 'إرسال الرأي'}
            </Button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}
