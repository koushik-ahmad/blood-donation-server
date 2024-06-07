export type IFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  searchTerm?: string | undefined;
  bloodType?: string | undefined;
  availability?: boolean | undefined;
};

export type DonorRequestData = {
  donorId: string;
  requesterId: string;
  phoneNumber: string;
  dateOfDonation: string;
  hospitalName: string;
  hospitalAddress: string;
  reason: string;
};
