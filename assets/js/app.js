"use strict";
let win = window,
    doc = document;

let find = function(a){
    return doc.querySelectorAll(a)
}

doc.addEventListener('DOMContentLoaded', function(){

    $('.toast').toast({delay: 2000});

    let title = find('#title')[0],
        desc = find('#desc')[0],
        date = find('#date')[0],
        image = find('#image')[0],
        categories = find('#categories')[0],
        tags = find('#tags')[0],

        preview = find('#preview')[0],
        editor = find('#editor')[0],

        download = find('#download')[0],
        save = find('#save')[0],
        md = window.markdownit();
    
    preview.style.height = editor.offsetHeight + 'px';

    (function(){
        let content;
        if(!localStorage.getItem("post")){
            let content = '# Hello World';
            preview.innerHTML = md.render(content);
            editor.value = content
        } else {
            let data = JSON.parse(localStorage.getItem("post"));
            content = data.content;

            title.value = data.title;
            desc.value = data.desc;
            date.value = data.date;
            image.value = data.image;
            categories.value = data.categories;
            tags.value = data.tags;

            preview.innerHTML = md.render(content);
            editor.value = content;
        }
    }())

    editor.addEventListener('keyup', function(){
        preview.innerHTML = md.render(editor.value);
    })
    save.addEventListener('click', function(){
        let temp = {
            title: title.value,
            desc: desc.value,
            date: date.value,
            image: image.value,
            categories: categories.value,
            tags: tags.value,
            content: editor.value
        }

        localStorage.setItem("post", JSON.stringify(temp));
        $('#toast').toast('show')
    })

    download.addEventListener('click', function(){
        let realDate = new Date(date.value),
            filename = realDate.toISOString().substr(0, 10)+"-"+title.value.replace(/[^a-z0-9]/gi, '-').toLowerCase()+".md",
            postDate = realDate.toISOString().substr(0, 19).replace("T", " ");

        let temp = "---\nlayout: post\ntitle: "+title.value+"\ndescription: "+desc.value+"\ndate: "+postDate+"\nimage: "+image.value+"\ncategories: ["+categories.value+"]\ntags: ["+tags.value+"]\n---\n\n"+editor.value,
            blob = new Blob([temp], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);

        this.href = url;
        this.target = "_blank";

        this.download = filename;
    })
});