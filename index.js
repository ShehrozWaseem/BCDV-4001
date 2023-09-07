//proof of work blockchain
//consensus mechanism
//all of nodes in bc compete to see who can solve the puzzle and first one to solve get the reward
//proof os stake - here diff users stake their token with nodes and the one with more token gets to choose the block
//proof of history is beign used by solana bc

//using sha-256
const SHA256 = require('crypto-js/sha256')

var counter = 0

// define the shape of the block
// with pow the diffifculty increases with time as coin is mined
// TO ASK difficulty, nonce concept
class Block{
    constructor(data,previousHash,timestamp,index,currentHash,nonce){
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = new Date().getTime()
        this.data = data
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    //use the sha256 algo to generate a hash of the information
    //the hash value of the calulation block
    //we are returning the hash via this finc
    //in the first block prev hash is zero
    //first block is called genesis block**
    //
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce ).toString();
    }

    mineBlock(difficulty){
        while(
            this.hash.substring(0,difficulty) !== Array(difficulty + 1).join('0')){
                this.nonce++
                this.hash = this.calculateHash()
            }
            console.log('mined blk' + this.index + '-> hasg val' + this.hash)
            return this.hash
    }
}

//construct the blockchain

class Blockchain {
    //first create the geensis block and set the mining difficulty
    //this refers to  the difficulty of finding a nonce that has a
    //certain no of zeroes at the begining of the string
    //diff = 3 , for eg means that the hash must start with '000'

    //the greater the difficulty, the more time geerally it takes to mine a block
    
    constructor(){
        this.chain = [this.createGenesis()]
        this.difficulty = 4;

    }
    //data, previousHash, timestamp, index, currentHash
    createGenesis(){
        return new Block('genesis block',0,'1/1/23',0,0)
    }

    //calculate the index of latest block
    latestBlock(){
        return this.chain[this.chain.length - 1]
    }

    //add a block to the blockchain
    addBlock(newBlock){
        //increment the block index
        newBlock.index = Number(this.latestBlock().index) + 1
        // create the link bw blk by setting the  new Blk's prevHash
        //to the proceedings Blks hash value
        newBlock.previousHash = this.latestBlock().hash
        //set new block hash to calc a new hash
        newBlock.hash = newBlock.mineBlock(this.difficulty)
        //push the new blk to the end of bc array
        this.chain.push(newBlock)
    }
    checkValid(){
        for(let i=1;i<this.chain.length;i++){
            //get the current block and the prev block and check if the hashes are valid
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]
            if(currentBlock.hash !== currentBlock.calculateHash()){
                console.log('hash is invalid')
                return false
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                console.log('has of prev blk is invalid')
                return false
            }
        }
        return true
    }
}

let jsChain = new Blockchain()
jsChain.addBlock(new Block('sample tx data 1'))
jsChain.addBlock(new Block('sample tx data 2'))
jsChain.addBlock(new Block('sample tx data 3'))
jsChain.addBlock(new Block('sample tx data 4'))
jsChain.addBlock(new Block('sample tx data 5'))

console.log(JSON.stringify(jsChain,null,4))
console.log('is the bc state valid' + jsChain.checkValid())

//hash is a finger print
//by setting the difficulty at 4 we can see the hash starts at 4x0