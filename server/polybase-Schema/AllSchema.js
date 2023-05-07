const user = `









@public
collection User {

  id: string;

  // We will use a public key to authenticate function
  // calls later
  publicKey: string;

  // A mandatory property
  name: string; 


  active:boolean;


  roles:string;


  


  constructor (id: string,publicKey:string,name:string,active:boolean) {

    this.id = id;
    
  
    this.publicKey = publicKey;

    this.name = name;

     this.active = active;

    this.roles = 'User';

  
  }


  function setName (name: string) {
    
    if (ctx.publicKey.toHex() != '0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9') {
      error('Unauthorized');
    }
    this.name = name;
  }


    function setRoles (role: string) {
    
    if (ctx.publicKey.toHex() != '0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9') {
      error('Unauthorized');
    }
      
    this.roles = 'Admin';
  }
}




@public
collection Collection {
  id:string;
  user: string;
  title: string;
  totalNotesInside:number;
 

  constructor (id: string, title: string,user:string,totalNotesInside:number) {
    this.id = id;
      this.title = title;
    this.user = user;
  
    this.totalNotesInside = totalNotesInside;
  
  }

   function updateTotalNotesInside (action:string) {
    
    if (ctx.publicKey.toHex() != '0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9') {
      error('Unauthorized');
    }

 


     if (action == '+') {
       this.totalNotesInside =  this.totalNotesInside + 1;
     } else {
       this.totalNotesInside =  this.totalNotesInside - 1;
     }
    
  }


   del () {
    if (ctx.publicKey.toHex() != '0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9') {
      throw error('Unauthorized');
    }
    selfdestruct();
  }
}



@public
collection Note {
  id:string;
  collectionID:string;
  userId: string;
  name: string;
  blobName:string;
  size:string;
  url:string;

  
 
 

  constructor (id: string, collectionID: string,name:string,userId:string,url:string,size:string,blobName:string) {
    this.id = id;
    this.userId = userId;
    this.collectionID = collectionID;
    this.name = name;
    this.url = url;
    this.size = size;
    this.blobName = blobName;
  
  }


    del () {
    if (ctx.publicKey.toHex() != '0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9') {
      throw error('Unauthorized');
    }
    selfdestruct();
  }


  
}


@public
collection PublicNotes {
  id:string;
  university:string;
  name: string;
  url:string;
  size:string;
  uploadedBy:string;
  subject:string;
  
 
 

  constructor (id: string, university: string,name:string,subject:string,url:string,size:string,uploadedBy:string) {
    this.id = id;
    this.subject = subject;
    this.university = university;
    this.name = name;
    this.url = url;
    this.size = size;
    this.uploadedBy = uploadedBy;
  
  }
}


@public
collection Favourite {
  id:string;
  parentNoteId:string;

  userId: string;
  name: string;
  url:string;
  size:string;

  
 
 

  constructor (id: string, name:string,parentNoteId:string,url:string,size:string,userId:string) {
    this.id = id;
    this.parentNoteId = parentNoteId;

    this.name = name;
    this.url = url;
    this.size = size;
    this.userId = userId;
  
  }

     del () {
    if (ctx.publicKey.toHex() != '0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9') {
      throw error('Unauthorized');
    }
    selfdestruct();
  }
}










 

`;
