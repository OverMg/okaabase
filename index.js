const { ClusterManager, ReClusterManager, HeartbeatManager, fetchRecommendedShards } = require("discord-hybrid-sharding");
const shardsPerClusters = 16;
require("dotenv").config();

const config = {
    totalShards: "auto",
    shardsPerClusters: shardsPerClusters,
    totalClusters: "auto",
    mode: "process",
    token: process.env.token,
    restarts: {
      max: 5,
      interval: 60 * 60000,
    },
    heartbeat: {
      interval: 2000,
      maxMissedHeartbeats: 5,
    }
};

const manager = new ClusterManager("./bot.js", config);
manager.extend(new HeartbeatManager(config.heartbeat));
manager.extend(new ReClusterManager());

manager.on("debug", (message) => console.log(`[Cluster]`.blue, message));

manager.on('clusterCreate', cluster => {
    cluster.on('message', message => {
        console.log(message);
        if (message._type !== messageType.CUSTOM_REQUEST) return;
        console.log(`[Cluster]`.blue, `Received message from client: ${message.content}`);
    });
    setInterval(() => {
        cluster.send({ content: 'I am alive' });
        cluster.request({ content: 'Are you alive?', alive: true })
            .then(e => console.log(e))
            .catch(err => console.error(`[Cluster]`.blue, `Error in cluster request: ${err}`));
    }, 5000);
});

async function spawnClusters() {
    try {
        await manager.spawn(undefined, undefined, -1);
        setInterval(async () => {
            await manager.broadcastEval(`this.ws.status && this.isReady() ? this.ws.reconnect() : 0`)
                .catch(err => console.error(`[Cluster]`.blue, `Error in broadcastEval: ${err}`));
        }, 60000);
    } catch (error) {
        console.error(`[Cluster]`.blue, `Error in spawnClusters: ${error}`);
    }

    setInterval(reclusterShards, 3 * 60 * 60 * 1000);
}

async function reclusterShards() {
    try {
        const recommendedShards = await fetchRecommendedShards(config.token);

        if (recommendedShards !== manager.totalShards) {
            const reclusterConfig = {
                restartMode: "gracefulSwitch",
                totalShards: recommendedShards,
                shardsPerClusters: shardsPerClusters,
                shardList: null,
                shardClusterList: null,
            };
            manager.recluster.start(reclusterConfig);
        }
    } catch (error) {
        console.error(`[Cluster]`.blue, `Error in reclusterShards: ${error}`);
    }
}

spawnClusters();