import { RequestHandler } from 'express';
import Axios from 'axios'
import SemVer from 'semver';
import { NPMPackage, DependencyInfo, VersionMetadata, VersionMetadataParcer, DependencyConflict } from './types';


/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getDependency: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  try {
    const npmPackage: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${version}`)).data;

    if (!npmPackage) {
      return res.status(200).json(`Package ${name}@${version} not found in registry`);
    }

    return res.status(200).json(npmPackage);
  } catch (error) {
    return next(error);
  }
};

/**
 * TBD
 */
export const getDependencyConflicts: RequestHandler = async function (req, res, next) {
  const { name, version, compareWith, compareWithVer } = req.params;

  try {
    const npmPackage: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${version}`)).data;
    const compareWithPackage: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${compareWith}/${compareWithVer}`)).data;

    if (!npmPackage || !compareWithPackage) {
      return res.status(404).json({
        msg: 'One or more packages were not found in registry',
        package: npmPackage,
        compareWith: compareWithPackage
      });
    }

    const depencencyTracker = {};
    const conflicts: DependencyConflict =  new DependencyConflict();

    await flattenAllDependencies(npmPackage, depencencyTracker, conflicts);
    await flattenAllDependencies(npmPackage, depencencyTracker, conflicts);

    return res.status(200).json({
      // represent projected flatten dependency list between package a & package b. 
      // Really handy to understand where dependency issue came from
      dependencies: depencencyTracker,
      conflics: conflicts.toTuples()
    });
  } catch (error) {
    return next(error);
  }
};

const flattenAllDependencies = async function (npmPackage: NPMPackage, dependencyTracker: any, conflicts: DependencyConflict) {
  if (!npmPackage || !npmPackage.dependencies)
    return;

  for (const [depName, depVer] of Object.entries(npmPackage.dependencies)) {
    // Check if dependency already being tracked
    let trackingDependency: DependencyInfo = dependencyTracker[depName];

    if (!trackingDependency) {
      trackingDependency = new DependencyInfo(depName, depVer, [npmPackage.name]);
      dependencyTracker[depName] = trackingDependency;
    } else if (!SemVer.intersects(trackingDependency.version, depVer)) {
      trackingDependency.referredBy.push(npmPackage.name);
      // quick & dirty trick to remove duplicates  
      trackingDependency.referredBy = [... new Set<string>(trackingDependency.referredBy)];
      conflicts.addConflict(depName, trackingDependency.version, depVer);
    }

    // Get and load package dependencies in recursion (No Optimization)
    const depencyPackage: NPMPackage | null = await getNpmPackage(trackingDependency);

    if (!!depencyPackage) {
      flattenAllDependencies(depencyPackage, dependencyTracker, conflicts)
    }
    else {
      // handle corner case. Means that NPM has no dependency, which is also depencency issue
      console.warn(`NPM has no depencency ${depName} ver. ${depVer}. Dependency will be skipped`);
    }
  }

}

const getNpmPackage = async function ({ name, version }: DependencyInfo): Promise<NPMPackage | null> {
  if (!name || !version) {
    console.error(`Missing dependency information (name: ${name}, version: ${version}`);
    return null;
  }

  const verMetadata = VersionMetadataParcer.parse(version);

  if (!verMetadata?.isValid || verMetadata?.isAnyMajorVer) {
    console.warn(
      `Invalid or '*' dependency will be skipped (name: ${name}, version: ${version}, isAnyMajorVer: ${verMetadata?.isAnyMajorVer})`);
    return null;
  }

  try {
    const npmPackage: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${verMetadata.cleanVersion}`)).data;
    return npmPackage;
  }
  catch (error) {
    console.log(error);
    return null;
  }
} 