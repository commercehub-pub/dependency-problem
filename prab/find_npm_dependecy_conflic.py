#!/usr/bin/python3
import argparse
import requests
import json
import sys
from urllib.request import urlopen
npm_registry = "https://registry.npmjs.org"
#dependency_type = "devDependencies" #we can use either devDependencies or peerDependencies
parser = argparse.ArgumentParser()
parser.add_argument("-p1", help="package1,ex:react",required=True)
parser.add_argument("-v1", help="version1",required=True)
parser.add_argument("-p2", help="package2, ex:npm",required=True)
parser.add_argument("-v2", help="version2",required=True)
parser.add_argument("-dt", help="dependencyType,ex:devDependencies",required=True)
args = parser.parse_args()

print( "p1 {} v1 {} p2 {} v2 {} dt {}".format(
        args.p1,
        args.v1,
        args.p2,
        args.v2,
        args.dt
        ))
def get_dependencies(package,version):
    #load npm registry url with given package and version
    url = npm_registry+"/"+package+"/"+version
    print("\n",url)
    #url = 'https://registry.npmjs.org/react/16.13.0'
    try:
        response = urlopen(url)
    except:
        print('\nFailed to open url:\t'+url+"\n")
        #Exit if given pacakge and version doesn't exist on registry
        sys.exit(1)
    data_json = json.loads(response.read())
        #print(data_json['dependencies'])
    dependency_list = data_json[args.dt]
    return dependency_list

def compare_dependencies(package1,package2):
    count = 0
    f1 = open("package1_dependencies.txt","w")
    f2 = open("package2_dependencies.txt","w")
    f3 = open("conflicts.txt","w")
    #Compare two dependency json files
    ##This packag1 iteration is not needed to for external processing writing to a file.
    for key in package1.keys():
        value = package1[key];
        f1.write(key+":"+value+"\n")
    ## This is needed to find duplicates
    for key in package2.keys():
        value = package2[key]
        f2.write(key+":"+value+"\n")
        #if key not in package1:
        #       print('')
        #else:
        if key in package1:
         #check if versions are not same
           if package1[key] != value:
               count +=1
               print("########################################################################################################################")
               print(count,") Dependency conflict")
               print("#############")
print("%s\n %s ==>[%s] \n%s\n %s ==>[%s]" % (args.p1,key ,package1[key],args.p2,key,value,))
               f3.write(args.p1+"="+key+":"+package1[key]+","+args.p2+"="+key+":"+value+"\n")
               print("########################################################################################################################")
           #else:
           #    print('')
                #print(key+"==>"+value)
    f1.close()
    f2.close()
    f3.close()
package1=get_dependencies(args.p1,args.v1)
print(package1)
package2=get_dependencies(args.p2,args.v2)
print(package2)
print("\n")
compare_dependencies(package1,package2)
