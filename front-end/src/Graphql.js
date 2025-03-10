import { gql } from "@apollo/client";

export const MUTATION_LOGIN = gql`
  mutation Mutation($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        documentId
        username
        email
        role {
          type
        }
      }
    }
  }
`;

export const MUTATION_REGISTER = gql`
  mutation Mutation($data: UsersPermissionsUserInput!) {
    createUsersPermissionsUser(data: $data) {
      data {
        documentId
        username
        email
        Fname
        Lname
        role {
          type
        }
        confirmed
      }
    }
  }
`;

export const ROLE = gql`
  query Query($filters: UsersPermissionsUserFiltersInput) {
    usersPermissionsUsers(filters: $filters) {
      role {
        type
      }
      documentId
      username
      email
      Fname
      Lname
    }
  }
`;

export const GET_PACKAGES = gql`
  query Packages {
    packages {
      documentId
      Title
      Type
      Price
      MeetingPoint
      Accommodation
      updatedAt
      bookings {
        documentId
        Start
        End
        slip {
          url
        }
        customer {
          email
          Fname
          Lname
          documentId
        }
        Status_booking
        HowManyPeople
      }
      Image {
        url
      }
      Date {
        documentId
        Start_Date
        End_Date
        MaxPeople
      }
      Description
    }
  }
`;

export const TRAVEL_DATE = gql`
  query TravelDates($filters: TravelDateFiltersInput) {
    travelDates(filters: $filters) {
      Start_Date
      End_Date
      MaxPeople
      package {
        Title
      }
      documentId
    }
  }
`;

export const ALL_IMAGES_PACKAGE = gql`
  query Image($filters: PackageFiltersInput) {
    packages(filters: $filters) {
      Image {
        url
      }
      documentId
    }
  }
`;

export const BOOKING = gql`
  query Bookings($filters: BookingFiltersInput) {
    bookings(filters: $filters) {
      documentId
      HowManyPeople
      TotalPrice
      package {
        Title
        Type
        documentId
      }
      Status_booking
      Start
      End
      RejectionReason
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation Mutation($documentId: ID!, $data: BookingInput!) {
    updateBooking(documentId: $documentId, data: $data) {
      Status_booking
      RejectionReason
    }
  }
`;

export const GET_APPROVED_BOOKINGS = gql`
  query GET_APPROVED_BOOKINGS($filters: BookingFiltersInput) {
    bookings(filters: $filters) {
      documentId
      Start
      End
      HowManyPeople
      TotalPrice
      Status_booking
      customer {
        Fname
        Lname
        email
      }
      package {
        Title
        Type
        Price
      }
      slip {
        url
      }
      updatedAt
    }
  }
`;

export const APPROVE_BOOKINGSD = gql`
  query Bookings($filters: BookingFiltersInput) {
    bookings(filters: $filters) {
      HowManyPeople
      Start
      documentId
      package {
        Title
      }
    }
  }
`;
export const DELETE_PACKAGE = gql`
  mutation DeletePackage($documentId: ID!) {
    deletePackage(documentId: $documentId) {
      documentId
    }
  }
`;

export const UPDATE_PACKAGE = gql`
  mutation UpdatePackage($documentId: ID!, $data: PackageInput!) {
    updatePackage(documentId: $documentId, data: $data) {
      documentId
      Title
      Description
      Image {
        url
        documentId
      }
      Price
      MeetingPoint
      Type
      Accommodation
    }
  }
`;
