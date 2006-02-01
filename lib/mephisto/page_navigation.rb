module Mephisto
  class PageNavigation < Liquid::Block
    include Reloadable
    include ActionView::Helpers::TagHelper

    def render(context)
      collection = context['pages']
      @tag       = context['tag']
      result     = []
      context.stack do
        collection.each_with_index do |page, index|
          context['page'] = {
            'link' => content_tag('a', page_title(page, index), :href => page_url(page, index)),
            'name' => page['title'],
            'url'  => page_url(page, index)
          }
          result << render_all(@nodelist, context)
        end
      end
      result
    end
    
    private
    def page_title(page, index)
      index.zero? ? 'Home' : page['title']
    end
    
    def page_url(page, index)
      "/#{@tag}#{'/show/' + page['permalink'] unless index.zero?}"
    end
  end
end