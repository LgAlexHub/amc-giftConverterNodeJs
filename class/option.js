module.exports=class Option{
    constructor(nomOption,valeur){
        this.nomOption=nomOption;
        this.valeur=valeur;
    }

    getNomOption(){
        return this.nomOption;
    }

    getValeur(){
        return this.valeur;
    }

    setNomOption(nomOption){
        this.nomOption=nomOption;
    }

    setValeur(valeur){
        this.valeur=valeur;
    }
}
