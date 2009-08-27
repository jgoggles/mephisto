# module Mephisto
#   module Liquid
#     class FacebookConnect < ::Liquid::Tag
#       include LiquidExtensions::Helpers
#       
#       def render(context)
#         render_erb(context, '/app/views/test/test.html.erb', :registers => context.registers)
#       end
#     end
#   end
# end
# 
# Liquid::Template.register_tag(:facebookconnect, Mephisto::Liquid::FacebookConnect)