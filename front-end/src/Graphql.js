import React from "react";
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
      Image {
        url
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
    }
  }
`;
