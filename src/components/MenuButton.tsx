import { ActionIcon, Menu } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";

export function MenuButton() {
  return (
    <Menu offset={2} withArrow width={100}>
      <Menu.Target>
        <ActionIcon>
          <IconMenu2 />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Vistas</Menu.Label>
        <Menu.Item>
          New
        </Menu.Item>
        <Menu.Item>
          Copy
        </Menu.Item>
        <Menu.Item>
          Edit
        </Menu.Item>
        <Menu.Item color='red'>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
