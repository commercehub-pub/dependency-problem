import { RequestHandler } from 'express';
import Axios from 'axios';
import { NPMPackage } from './types';

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getDependencyConflicts: RequestHandler = async function (req, res, next) {
  const { name, versionOne, versionTwo } = req.params;

  try {
    const npmPackageOne: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${versionOne}`)).data;
    const npmPackageTwo: NPMPackage = (await Axios.get(`https://registry.npmjs.org/${name}/${versionTwo}`)).data;

    if (!npmPackageOne.dependencies || !npmPackageTwo.dependencies) {
      return res.status(200).json(`Package ${name}@${versionOne} or ${name}@${versionTwo} not found in registry`);
    }

    const tupleOne: [string[], string[], string[]] = [ [ 'dependency' ], [ 'version' ], [ 'dependency:version' ] ];
    const tupleTwo: [string[], string[], string[]] = [ [ 'dependency' ], [ 'version' ], [ 'dependency:version' ] ];
    const conflictCompare: [string, string] = [ '', '' ];

    createTuple(npmPackageOne.dependencies, tupleOne);
    createTuple(npmPackageTwo.dependencies, tupleTwo);

    const conflicts = conflictingDependencies(tupleOne, tupleTwo, conflictCompare);

    if ((Array.isArray(conflicts) && !conflicts.length)) {
      return res.status(200).json({
        'message': `Package ${name}@${versionOne} and ${name}@${versionTwo} have no conflicting dependencies`,
        'differences': 'No conflicts',
      });
    }
    return res.status(200).json({
      'message': `Package ${name}@${versionOne} and ${name}@${versionTwo} have conflicting dependencies`,
      'differences': conflicts,
    });

  } catch (error) {
    return next(error);
  }
};

/**
 * Create tuple from npmPackage dependencies object
 *
 * @param dependencies - the npmPackage.depencies object
 * @param tuple - the tuple being created
 */
function createTuple(dependencies: { [packageName: string]: string; }, tuple: [string[], string[], string[]]): void {
  for (const entry of Object.entries(dependencies)) {
    tuple[0].push(entry[0]);
    tuple[1].push(entry[1]);
    tuple[2].push(`${entry[0]}:${entry[1]}`);
  }
}

/**
 * Return conflicting 'dependency:versions' for both main level dependencies
 *
 * @param tupleOne - the first tuple being passed to check for conflicts
 * @param tupleTwo - the second tuple being passed to check for conflicts
 * @param tupleConflicts - the tuple conflicts sent to the response
 * @returns {string[]} - returns a tuple of 'dependency:version' conflicts
 * @example
 *  [
 *    "object-assign:^4.1.1",
 *    "object-assign:^4.0.1"
 *  ]
 */
function conflictingDependencies(tupleOne: [string[], string[], string[]], tupleTwo: [string[], string[], string[]],
  tupleConflicts: [string, string]): string[] {
  const conflictsOne = tupleOne[2].filter(item =>
    tupleTwo[0].indexOf(item.split(':')[0]) >= 0
    && tupleTwo[1].indexOf(item.split(':')[1]) < 0
    && item !== 'dependency:version',
  );
  const conflictsTwo = tupleTwo[2].filter(item =>
    tupleOne[0].indexOf(item.split(':')[0]) >= 0
    && tupleOne[1].indexOf(item.split(':')[1]) < 0
    && item !== 'dependency:version',
  );
  for (const version of conflictsOne) {
    tupleConflicts[0] = version;
  }
  for (const version of conflictsTwo) {
    tupleConflicts[1] = version;
  }
  return tupleConflicts.filter(() =>
    tupleConflicts[0] !== ''
    && tupleConflicts[1] !== '',
  );
}
