#Assume python3 is installed on the linux server, if not please install python3
#alias python=/usr/bin/python3
chmod 755 find_npm_dependency_conflict.py  
### sudo su - root to install module "requests"  
sudo su -  
alias python=/usr/bin/python3  
python3 -m pip install requests  
exit #exit as root user  
###run python script with package1,version1 & package2, version2 & [dependencies/devDependencies/peerDependencies] as arguments  
##Ex: ./find_npm_dependency_conflict.py -p1 async -v1 2.1.4 -p2 yo -v2 1.8.5 -dt dependencies  
##Ex: ./find_npm_dependency_conflict.py -p1 async -v1 2.1.4 -p2 yo -v2 1.8.5 -dt devDependencies  
### ./find_npm_dependency_conflict.py -p1 async -v1 2.1.4 -p2 yo -v2 1.8.5 -dt dependencies  
p1 async v1 2.1.4 p2 yo v2 1.8.5 dt dependencies  

####  **sample output**

 https://registry.npmjs.org/async/2.1.4
{'lodash': '^4.14.0'}

 https://registry.npmjs.org/yo/1.8.5
{'async': '^1.0.0', 'chalk': '^1.0.0', 'cli-list': '^0.1.1', 'configstore': '^1.0.0', 'cross-spawn': '^3.0.1', 'figures': '^1.3.5', 'fullname': '^2.0.0', 'got': '^5.0.0', 'humanize-string': '^1.0.0', 'inquirer': '^0.11.0', 'insight': '^0.7.0', 'lodash': '^3.2.0', 'meow': '^3.0.0', 'npm-keyword': '^4.1.0', 'opn': '^3.0.2', 'package-json': '^2.1.0', 'parse-help': '^0.1.1', 'read-pkg-up': '^1.0.1', 'repeating': '^2.0.0', 'root-check': '^1.0.0', 'sort-on': '^1.0.0', 'string-length': '^1.0.0', 'tabtab': '^1.3.0', 'titleize': '^1.0.0', 'update-notifier': '^0.6.0', 'user-home': '^2.0.0', 'yeoman-character': '^1.0.0', 'yeoman-doctor': '^2.0.0', 'yeoman-environment': '^1.6.1', 'yosay': '^1.0.0'}

### List conflicting packages

########################################################################################################################
1 ) Dependency conflict  
#############  
async  
 lodash ==>[^4.14.0]  
yo  
 lodash ==>[^3.2.0]  
########################################################################################################################  
