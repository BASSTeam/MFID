import main from './pages/main.js'
import notFound from './pages/404.js'

const pages = {
	main,
	notFound,
};

registerAction('getPage', async name => {
	if(name in pages) return await pages[name]();
	return pages.notFound()
})
