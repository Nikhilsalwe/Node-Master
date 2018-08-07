/*
* library for storing and editing data
*/

//Depandancies
var fs = require('fs');
var path = require('path');

//Container for module to be exported
var lib = {};

//base directory for data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//write data to file
lib.create = function(dir,file,data,callback){
	//to open file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,filedescriptor){
		console.log('filedescriptor', filedescriptor);
		if(!err && filedescriptor){
			//convert data to string

			var stringData = JSON.stringify(data);

			//write file and close it
			fs.writeFile(filedescriptor, stringData, function(err){
				if(!err){
					fs.close(filedescriptor, function(err){
						if(!err){
							callback(false);	
						} else{
							callback('error closing new file')
						}
					})
				} else {
					callback('error writing new file');
				}
			})
		} else {
			callback('could not found filr or file may exits already');
		}
	});
};

//To read file
lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err, data){
		callback(err,data);
	})
}

//Update file
lib.update = function(dir,file,data,callback){
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+', function(err, filedescriptor){
		if(!err && filedescriptor){
			var stringData = JSON.stringify(data);

			//truncate file
			fs.truncate(filedescriptor, function(err){
				if(!err){
				//write file and close it
							fs.writeFile(filedescriptor, stringData, function(err){
								if(!err){
									fs.close(filedescriptor, function(err){
										if(!err){
											callback(false);	
										} else{
											callback('error closing new file')
										}
									})
								} else {
									callback('error writing new file');
								}
							})
				}else {
					callback('error truncarting file')
				}
			})
		} else {
			callback('could not found the file o may already exits');
		}
	})
}

//delete file
lib.delete = function(dir,file,callback){
	//unlink file remove file from directory
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
		if(!err){
			callback(false);
		} else {
			callback('error deleting file')
		}
	})
}



//Exported module
module.exports = lib;