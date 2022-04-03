import { raw } from "express";
import semver from "semver";

/**
 * The result of a package request against `https://registry.npmjs.org`. This is
 * a subset of the returned data, not a full representation, that contains
 * everything you will need to carry out the exercise.
 *
 * @example
 * {
 *   "name": "react",
 *   "description": "React is a JavaScript library for building user interfaces.",
 *   "dist-tags": {
 *     "latest": "16.13.0"
 *   },
 *   "versions": {
 *     "16.13.0": {
 *       "name": "react",
 *       "version": "16.13.0",
 *       "dependencies": {
 *         "loose-envify": "^1.1.0",
 *         "object-assign": "^4.1.1",
 *         "prop-types": "^15.6.2",
 *       }
 *     }
 *   }
 * }
 */
export interface NPMPackage {
  name: string;
  description: string;
  'dist-tags': {
    [tag: string]: string;
  };
  versions: [];
  version: string;
  dependencies?: {
    [packageName: string]: string;
  };
}

export interface DependencyConflictResponse{
  dependencies: any;
  conflics: Array<[string, string, string]>;
}

export interface DependencyConflict{
  dependencyPackageName:string,
  version:string,
  conflictWithVersion:string
}

export class DependencyInfo{
  name: string;
  version: string;
  referredBy: string[];
    
  constructor(name: string, version: string, referredBy: string[]){
    this.name = name;
    this.version = version;
    this.referredBy = referredBy;
  }
}

export interface VersionMetadata{
  rawVersion: string;
  cleanVersion?: string;
  isValid: boolean;
  isAnyMajorVer : boolean;
}

export class VersionMetadataParcer{
  public static parse(rawVersion: string) : VersionMetadata {  
    let verMeta: VersionMetadata =  {rawVersion, isValid: true, isAnyMajorVer: false};
    
    if (verMeta.rawVersion.trim() === '*'){
      verMeta.isAnyMajorVer = true;
      return verMeta;
    }

    let verToClean = rawVersion;

    // Select latest ver if package ref has multiple alternatives liek '1.0.0 || 2.2.2'
    const alternatives = verMeta.rawVersion.split('||');
    if ( alternatives.length > 1 ){
      verToClean = alternatives[alternatives.length-1].trim();
    }

    // 
    //verMeta.cleanVersion = semver.coerce(verToClean, {})?.format();
    verMeta.cleanVersion = verToClean.replace(/[\^,~,\*,>,=]{0,2}/,'').trim();

    return verMeta;
  }
}