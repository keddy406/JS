const PATH = "./data.json";
//read files
const fs = require('fs');


class Post{
    get(){
        /*get Posts*/
        return this.readData();
    }

    getIndividualBlog(postId){
        /*Get one Blog Post */
        const posts = this.readData();
        const foundPost = posts.find((post)=>post.id ==postId);
        return foundPost;
    }

    add(newpPost){
        /* Add New Post */
        const currentPosts = this.readData();
        currentPosts.unshift(newpPost);
        this.storeData(currentPosts);
    }

    readData(){
        let rawdata = fs.readFileSync(PATH)
        let posts = JSON.parse(rawdata);
        return posts;
    }
    storeData(rawdata){
        let data = JSON.stringify(rawdata);
        fs.writeFileSync(PATH, data);
    }
}

/* every time import a module need to be exported*/
module.exports = Post;
