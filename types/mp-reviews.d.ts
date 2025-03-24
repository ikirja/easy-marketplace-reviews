export type WBReviewResponse = {
  data: {
    countUnanswered: number;
    countArchive: number;
    feedbacks: WBReview[];
  };
};

export type WBReview = {
  id: string;
  text: string;
  pros: string;
  cons: string;
  productValuation: number;
  createdDate: Date;
  productDetails: {
    supplierArticle: string;
  };
};

export type LocalReview = {
  createdAt?: Date;
  updatedAt: Date.now;
  wbFeedbackId: string;
  text: string;
  pros: string;
  cons: string;
  productId: string;
  productValuation: number;
};

export type LocalReviewUpdateQuery = {
  updateOne: {
    filter: {
      wbFeedbackId: string;
    };
    update: LocalReview;
    upsert: boolean;
  };
};
