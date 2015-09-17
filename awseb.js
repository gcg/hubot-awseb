//
// Description
//   AWS ElasticBeanstalk management via Hubot. 
//
// Dependencies:
//   aws-sdk
//
// Configuration:
//   None
//
// Commands:
//   hubot awseb apps - List applications on elasticbeanstalk that this bot has access
//   hubot awseb list <app> - list env for the <app>
//   hubot awseb info <app> <env> - get information about <app>'s <env> 
//   hubot awseb versions <app> - get application versions for an <app>
//   hubot awseb deploy <app> <version> - deploy the <version> to the <app>
//
// Notes:
//   None
//
// Author:
//   @gcg
//

var AWS = require('aws-sdk');
var eb = new AWS.ElasticBeanstalk();

module.exports = function(robot) {

    robot.respond(/awseb\s+env\s+(.+$)/i, function(msg){
        var match = msg.match, filter;

        filter = match[1].trim();

        var e = process.env[filter];

        msg.send('Ok ok: The '+filter+' is: '+e);

    });

    robot.respond('/awseb apps/i', function(msg){
        msg.send("Getting the avaliable applications from ElasticBeanstalk...");
        eb.describeApplications({}, function(err, data){
            if (err) {
                console.log(err);
                console.log(err.stack);
                msg.send("There was an error while getting the applications from AWS EleasticBeanstalk, please check the logs");
            }       
            if (null === data) {
                console.log('data is null for an application');a
                    msg.send("There was an error while getting the applications from AWS EleasticBeanstalk, please check the logs");
            }

            for (var i = 0, l = data.Applications.length; i < l; i ++) {
                var app = data.Applications[i];
                msg.send("[*"+app.ApplicationName+"*] last updated at: "+app.DateUpdated);
            }
        });


    });

    robot.respond(/awseb\s+list\s+(.+$)/i, function(msg){
        var match = msg.match, app;
        app = match[1].trim();
        msg.send("Hold on while I fetch the avaliable environments for the app: [*"+app+"*]");

        eb.describeEnvironments({ApplicationName: app}, function(err, data){
            if (err) {
                console.log(err);
                console.log(err.stack);
                msg.send("There was an error while getting the avaliable environments for the app: "+app);
            }

            if (null === data) {
                console.log('data is null for environment');
                msg.send("There was an error while getting the avaliable environments for the app: "+app);
            }

            for (var i = 0, l = data.Environments.length; i < l; i ++) {
                var env = data.Environments[i];
                msg.send("[*"+env.Health+"*] *"+env.EnvironmentName+"* which has the *"+env.VersionLabel+"* running and last updated at: "+env.DateUpdated+" \n"+"Status is *"+env.Status+"* \n"+"You can access the environment with this url: "+env.EndpointURL+" \n");
                msg.send("---------------------------------------");
            }
        });
    });

}
