import { RequestHandler } from 'express';
import Axios from 'axios'
import { NPMPackage } from './types';

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getDependency: RequestHandler = async function (req, res, next) {
  let { name, version } = req.params;
  let packages: string[] = [];
  let npmPackages: NPMPackage[] = [];

  // handle request at /dependency with body name,version
  if (!name && !req.body.packages) {
    name = req.body.name;
    version = req.body.version;
  }

  // handle request at /dependency with body packages
  // TODO: validate packages CSV with regex, toss invalid
  if (req.body.packages) {
    console.info(`request.body.packages: ${req.body.packages}`)
    packages = req.body.packages.split(',')
    console.info(`Packages in request: ${JSON.stringify(packages)}`)
  } else {
    packages = [ `${name}@${version}` ]
  }

  for (let i = 0; i < packages.length; i++) {
    try {
      console.info(`Request package: ${packages[i]}`)
      npmPackages.push((await Axios.get(`https://registry.npmjs.org/${packages[i].split('@')[0]}/${packages[i].split('@')[1]}`)).data);

    } catch (error) {
      return next(error);
    }
  }

  if (!npmPackages) {
    return res.status(200).json(`Packages not found in registry: ${packages}`);
  }

  if (npmPackages.length >= 2 && req.body.onlyConflicts == true) {
    let allDeps: any = {}
    let conflicts: any[] = []

    for (let i = 0; i < npmPackages.length; i++) {
      let dependencies: any = npmPackages[i].dependencies;

      Object.keys(dependencies).forEach ( (dep) => {
        if (!Object.keys(allDeps).includes(dep)) {
          allDeps[dep] = dependencies[dep]
        } else {
          if (allDeps[dep] == dependencies[dep]) {
            // no conflict
          } else {
            // TODO: use object instead? when dealing with 3+ packages, this can result in multiple tuples for a single dependency
            conflicts.push([dep, allDeps[dep], dependencies[dep]])
            // allDeps[dep] = [allDeps[dep], dependencies[dep]]
          }
        }
      })
    }

    console.info(`Conflicts: ${JSON.stringify(conflicts)}`)

    return res.status(200).json(conflicts);

  } else {
    if (npmPackages.length == 1) {
      return res.status(200).json(npmPackages[0]); // don't return array if there's only one (hacky way to preserve the existing test)
    } else {
      return res.status(200).json(npmPackages);
    }
  }
};
