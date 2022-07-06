import { RequestHandler } from 'express';
import Axios from 'axios'
import { NPMPackage } from './types';
import { json } from 'stream/consumers';

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getDependency: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  try {
    const npmPackage: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${version}`)).data
 
    if (!npmPackage) {
      return res.status(200).json(`Package ${name}@${version} not found in registry`);
    }
  
    return res.status(200).json(npmPackage.dependencies);

  } catch (error) {
    return next(error);
  }
};


export const getMultiDependency: RequestHandler = async function (req, res, next) {
  const { name, version, versionNew } = req.params;

  try {
    const npmPackage: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${version}`)).data
    const npmPackageNew: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${versionNew}`)).data
    const Package: [string[],string[]] = [ [ 'dependencies' ], [ 'versions' ]];
    const PackageNew: [string[],string[]] = [ [ 'dependencies' ], [ 'versions' ]];
   

    let list= res.json(npmPackage.dependencies)
    let listNew  = res.json(npmPackageNew.dependencies)

 const finalset =   json.list.forEach(element => {
      Package[0].push(element[0])
      Package[1].push(element[1])
    });

    const finalsetNew =   json.list.forEach(element => {
      PackageNew[0].push(element[0])
      PackageNew[1].push(element[1])
    });
   
   if(finalset == finalsetNew){
    return `Package ${name}@${version} and ${name}@${versionNew} have no conflicts`
   }
   return `Package ${name}@${version} and ${name}@${versionNew} have conflicts`

  } catch (error) {
    return next(error);
  }
};