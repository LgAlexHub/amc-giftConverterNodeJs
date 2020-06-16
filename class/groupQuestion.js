module.exports=class GroupeQuestion{
    constructor(groupeQ,option,titre){
        this.groupeQ=groupeQ;
        this.option=option;
        this.titre=titre;
    }
    
    /*
    *   Return all questions which are in the group
    */
    getGroupeQ(){
        return this.groupeQ;
    }

    getOption(){
        return this.option;
    }

    getTitre(){
        if (this.titre != null){
            return this.titre;
        }
    }

    setTitre(titre){
        this.titre =titre;
    }

    setGroupeQ(groupe){
        this.groupeQ=groupe;
    }

    setOption(option){
        this.option = option;
    }
    
    
}