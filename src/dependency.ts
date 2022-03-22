import { RequestHandler } from 'express';
import Axios from 'axios'
import SemVer from 'semver'
import { DependencyResponse, NPMPackage } from './types';

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getDependency: RequestHandler = async function (req, res, next) {
  const { name_a, version_a, name_b, version_b } = req.params;
  try {
    // prep the result object
    var result: DependencyResponse = new DependencyResponse();

    // get Package A
    const npmPackage_a: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name_a}/${version_a}`)).data;
    // TODO Axios.get() throws on non susccess status and registry.npmjs.org returns 404 when package is not found. Needs rework
    if (!npmPackage_a) {
      return res.status(200).json(`Package ${name_a}@${version_a} not found in registry`);
    }
    result.packages.push(npmPackage_a)

    // Get Package B
    const npmPackage_b: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name_b}/${version_b}`)).data;
    // TODO Axios.get() throws on non susccess status and registry.npmjs.org returns 404 when package is not found. Needs rework
    if (!npmPackage_b) {
      return res.status(200).json(`Package ${name_b}@${version_b} not found in registry`);
    }
    result.packages.push(npmPackage_b)

    // If A and B are the same package and version, there is no need to check compatibility
    if (npmPackage_a.name == npmPackage_b.name && npmPackage_a.version == npmPackage_b.version) {
        return res.status(200).json(result);
    }

    // initialize empty objects on dependencies if they don't exist
    if (!npmPackage_a.dependencies) {
        npmPackage_a.dependencies = {};
    }
    if (!npmPackage_b.dependencies) {
        npmPackage_b.dependencies = {};
    }
    // Dependency look up to prevent double looping
    var depMap = new Map<string,string>();
    // Loop through dependencies on npmPackage_a and populate depMap
    for (const [dependency, version] of Object.entries(npmPackage_a.dependencies)) {
        // don't bother with * entries as they will be compatible with any version
        if (version == '*') {
            continue
        }
        // if npmPackage_a depends on npmPackage_b, check that it is compatible
        if (dependency == npmPackage_b.name && !SemVer.intersects(version_b, version)) {
            result.conflicts.push([dependency, version, version_b])
        }
        depMap.set(dependency, version)
    }
    // Loop through dependencies on npmPackage_b and check the depMap
    for (const [dependency, versionB] of Object.entries(npmPackage_b.dependencies)) {
      // don't bother with * entries as they will be compatible with any version
      if (versionB == '*') {
        continue
      }
      // if npmPackage_b depends on npmPackage_a, check that it is compatible
      if (dependency == npmPackage_a.name && !SemVer.intersects(version_a, versionB)) {
        result.conflicts.push([dependency, version_a, versionB])
      }
      // look up the dependency in the depMap and continue if not present
      var versionA = depMap.get(dependency)
      if (!versionA) {
        continue;
      }
      // If versionA and versionB don't intersect, add tuple to result.
      if (!SemVer.intersects(versionA, versionB)) {
        result.conflicts.push([dependency, versionA, versionB])
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
