import { GithubUsers } from "./GithubUser.js"




export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load(){

        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    async add(username){
        try{

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error('User already exists')
            }

            const user = await GithubUsers.search(username);

            if(user.login === undefined ){
                throw new Error(`User couldn't be found!`)
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error){
            alert(error.message)
        }
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}


export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('tbody')
        
        this.update()
        this.onAdd()
    }

    onAdd(){
        const addButton = this.root.querySelector('.search button').addEventListener('click', () =>{
            let { value } = this.root.querySelector('.search input')

            this.add(value)
        })
    }

    update(){
        this.removeAllTr()
        
        this.entries.forEach(user =>{
            const row = this.createRow()

            row.querySelector('.user img').src = `http://www.github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Image of ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `http://www.github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos;
            row.querySelector('.followers').textContent = user.followers;

            row.querySelector('.remove').addEventListener('click', () =>{
                const isOK = confirm('Are you sure you want to delete this item?')
                if(isOK){
                    this.delete(user)
                }
            })

            this.tbody.append(row)
        })

    }

    createRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="user">
                <img src="http://www.github.com/hugominzoni.png" alt="User Picture">
                <a href="http://www.github.com/hugominzoni" target="_blank">
                    <p>Hugo Minzoni</p>
                    <span>hugominzoni</span>
                </a>
            </td>
            <td class="repositories">17</td>
            <td class="followers">1</td>
            <td>
                <button class="remove">&times;</button>
            </td>`;
        return tr
    }

    removeAllTr(){
        

        this.tbody.querySelectorAll('tr').forEach((tr) =>{tr.remove()})
    }
}