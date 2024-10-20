import {
  CareerGroupType,
  LanguageType,
  WorkingMethodType,
} from '../../utilities/app-enum';

export interface CareerModel {
  id?: number;
  title?: string;
  group?: CareerGroupType;
  groupName?: string;
  location?: string;
  salary?: string;
  workingMethod?: WorkingMethodType;
  workingMethodName?: string;
  startTime?: string;
  endTime?: string;
  department?: string;
  expiredApply?: Date;
  description?: string;
  type?: LanguageType;
  imageUrl?: string;
}

export interface CareerViewModel {
  id?: number;
  title?: string;
  group?: CareerGroupType;
  groupName?: string;
  location?: string;
  salary?: string;
  workingMethod?: WorkingMethodType;
  workingMethodName?: string;
  startTime?: string;
  endTime?: string;
  department?: string;
  expiredApply?: Date;
  description?: string;
  type?: LanguageType;
  image?: string | any;
  imageUrl?: string | any;
}
