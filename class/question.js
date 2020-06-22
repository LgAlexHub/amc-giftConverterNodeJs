module.exports=class Question{
        constructor(question,reponse,option,strat){
            this.question=question;
            this.reponse=reponse;
            this.option=option;
            this.strat = strat
        }

        getQuestion(){
            return this.question;
        }

        getReponse(){
            return  this.reponse;
        }

        setQuestion(question){
            this.question = question;
        }

        setReponse(reponse){
            this.reponse;
        }

        getStrat(){
            return this.strat;
        }

        setStrat(strat){
            this.strat = strat
        }

        getOption(){
            return this.option;
        }

        setOption(options){
            this.option = options;
        }

        isMultipleReponse(){
            let compteur = 0;
            let reponseArr = this.getReponse();
            for (let i = 0 ; i<reponseArr.length;i++){
                if (reponseArr[i].getRight()==true){
                    compteur++;
                }
            }
            return compteur>1;
        }
}