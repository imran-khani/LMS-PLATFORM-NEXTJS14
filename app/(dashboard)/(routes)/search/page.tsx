import { db } from "@/lib/db"
import Categories from "./_components/Categories"
import SearchInput from "@/components/search-input"
const Search = async () => {

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })
    return (
        <>
            <div className="px-6 pt-6 hidden md:mb-0 max-sm:block">
                <SearchInput />
            </div>
            <div className="p-6">
                <Categories
                    items={categories}
                />
            </div>
        </>
    )
}

export default Search